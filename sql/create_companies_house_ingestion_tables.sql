-- Tables for Companies House ingestion and nationality split.
-- Run in Supabase SQL Editor or via a DB client.

create extension if not exists pgcrypto;

create or replace function public.random_download_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

create or replace function public.generate_unique_download_code(target_table text)
returns text
language plpgsql
as $$
declare
  candidate text;
  already_exists boolean;
  attempts int := 0;
begin
  loop
    attempts := attempts + 1;
    candidate := public.random_download_code();

    if target_table = 'ch_directors_ro' then
      select exists(
        select 1 from public.ch_directors_ro where download_code = candidate
      ) into already_exists;
    else
      select exists(
        select 1 from public.ch_directors_non_ro where download_code = candidate
      ) into already_exists;
    end if;

    if not already_exists then
      return candidate;
    end if;

    if attempts > 50 then
      raise exception 'Could not generate unique download code after % attempts', attempts;
    end if;
  end loop;
end;
$$;

create or replace function public.set_ch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.ch_import_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz null,
  status text not null default 'running',
  incorporated_from date not null,
  incorporated_to date not null,
  sic_code text not null,
  size text not null,
  max_companies integer not null default 2000 check (max_companies > 0),
  total_hits integer not null default 0,
  companies_fetched integer not null default 0,
  active_processed integer not null default 0,
  psc_ok integer not null default 0,
  psc_failed integer not null default 0,
  ro_upserted integer not null default 0,
  non_ro_upserted integer not null default 0,
  advanced_search_payload jsonb not null default '[]'::jsonb,
  psc_errors jsonb not null default '[]'::jsonb
);

create table if not exists public.ch_directors_non_ro (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  run_id uuid null references public.ch_import_runs(id) on delete set null,
  company_number text not null,
  company_name text not null,
  company_status text null,
  incorporated_at date null,
  sic_codes text[] not null default '{}'::text[],
  full_name text not null,
  director_full_name text not null,
  campaign_status text not null default 'to_send',
  industry text null,
  nationality_raw text not null default 'unknown',
  nationality_normalized text not null,
  download_code text null,
  letter_template text null,
  qr_code_link text null,
  correspondence_address jsonb not null default '{}'::jsonb,
  registered_address jsonb not null default '{}'::jsonb
);

create table if not exists public.ch_directors_ro (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  run_id uuid null references public.ch_import_runs(id) on delete set null,
  company_number text not null,
  company_name text not null,
  company_status text null,
  incorporated_at date null,
  sic_codes text[] not null default '{}'::text[],
  full_name text not null,
  director_full_name text not null,
  campaign_status text not null default 'to_send',
  industry text null,
  nationality_raw text not null default 'unknown',
  download_code text null,
  letter_template text null,
  qr_code_link text null,
  correspondence_address jsonb not null default '{}'::jsonb,
  registered_address jsonb not null default '{}'::jsonb
);

create unique index if not exists idx_ch_directors_non_ro_unique
  on public.ch_directors_non_ro (company_number, director_full_name, nationality_raw);

create unique index if not exists idx_ch_directors_ro_unique
  on public.ch_directors_ro (company_number, director_full_name, nationality_raw);

create unique index if not exists idx_ch_directors_non_ro_download_code_unique
  on public.ch_directors_non_ro (download_code)
  where download_code is not null;

create unique index if not exists idx_ch_directors_ro_download_code_unique
  on public.ch_directors_ro (download_code)
  where download_code is not null;

create or replace function public.set_ch_download_and_qr()
returns trigger
language plpgsql
as $$
declare
  campaign_name text;
  base_qr_url text;
  first_name_from_full text;
  should_refresh_qr boolean;
begin
  if new.full_name is null or btrim(new.full_name) = '' then
    new.full_name := new.director_full_name;
  end if;

  if new.campaign_status is null or btrim(new.campaign_status) = '' then
    new.campaign_status := 'to_send';
  end if;

  if new.download_code is null or btrim(new.download_code) = '' then
    if tg_table_name = 'ch_directors_ro' then
      new.download_code := public.generate_unique_download_code('ch_directors_ro');
    else
      new.download_code := public.generate_unique_download_code('ch_directors_non_ro');
    end if;
  end if;

  should_refresh_qr :=
    new.qr_code_link is null
    or btrim(new.qr_code_link) = ''
    or tg_op = 'INSERT'
    or old.download_code is distinct from new.download_code;

  if should_refresh_qr then
    campaign_name := case
      when tg_table_name = 'ch_directors_ro' then 'first_letter_ro_director'
      else 'first_letter_non_ro_director'
    end;

    base_qr_url := coalesce(current_setting('app.qr_base_url', true), 'https://www.ezwebone.co.uk/guides');
    first_name_from_full := split_part(coalesce(new.full_name, ''), ' ', 1);

    new.qr_code_link := base_qr_url
      || '?UTM_CAMPAIGN=' || campaign_name
      || '&UTM_SOURCE=letter'
      || '&UTM_MEDIUM=qr_code'
      || '&UTM_NICHE=' || replace(coalesce(new.industry, ''), ' ', '%20')
      || '&UTM_TITLE=' || replace(coalesce(new.company_name, ''), ' ', '%20')
      || '&UTM_TERM=' || replace(coalesce(first_name_from_full, ''), ' ', '%20')
      || '&UTM_CONTENT=' || coalesce(new.company_number, '')
      || '&company_number=' || coalesce(new.company_number, '')
      || '&source=' || case when tg_table_name = 'ch_directors_ro' then 'ro' else 'non_ro' end
      || '&code=' || new.download_code;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_ch_directors_non_ro_code_qr on public.ch_directors_non_ro;
create trigger trg_ch_directors_non_ro_code_qr
before insert or update on public.ch_directors_non_ro
for each row
execute function public.set_ch_download_and_qr();

drop trigger if exists trg_ch_directors_ro_code_qr on public.ch_directors_ro;
create trigger trg_ch_directors_ro_code_qr
before insert or update on public.ch_directors_ro
for each row
execute function public.set_ch_download_and_qr();
