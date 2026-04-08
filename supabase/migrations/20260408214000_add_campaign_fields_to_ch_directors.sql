create sequence if not exists public.ch_non_ro_download_code_seq start 1 increment 1;
create sequence if not exists public.ch_ro_download_code_seq start 1 increment 1;

create or replace function public.base36_encode(input_value bigint)
returns text
language plpgsql
as $$
declare
  chars text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  value bigint := input_value;
  result text := '';
  remainder int;
begin
  if value < 0 then
    raise exception 'base36_encode only accepts non-negative values';
  end if;

  if value = 0 then
    return '0';
  end if;

  while value > 0 loop
    remainder := (value % 36)::int;
    result := substr(chars, remainder + 1, 1) || result;
    value := value / 36;
  end loop;

  return result;
end;
$$;

alter table public.ch_directors_non_ro
  add column if not exists full_name text,
  add column if not exists campaign_status text not null default 'to_send',
  add column if not exists industry text,
  add column if not exists download_code text,
  add column if not exists letter_template text,
  add column if not exists qr_code_link text;

alter table public.ch_directors_ro
  add column if not exists full_name text,
  add column if not exists campaign_status text not null default 'to_send',
  add column if not exists industry text,
  add column if not exists download_code text,
  add column if not exists letter_template text,
  add column if not exists qr_code_link text;

create or replace function public.set_ch_download_and_qr()
returns trigger
language plpgsql
as $$
declare
  next_number bigint;
  campaign_name text;
  base_qr_url text;
begin
  if new.full_name is null or btrim(new.full_name) = '' then
    new.full_name := new.director_full_name;
  end if;

  if new.campaign_status is null or btrim(new.campaign_status) = '' then
    new.campaign_status := 'to_send';
  end if;

  if new.download_code is null or btrim(new.download_code) = '' then
    if tg_table_name = 'ch_directors_ro' then
      next_number := nextval('public.ch_ro_download_code_seq');
    else
      next_number := nextval('public.ch_non_ro_download_code_seq');
    end if;
    new.download_code := lpad(public.base36_encode(next_number), 6, '0');
  end if;

  if new.qr_code_link is null or btrim(new.qr_code_link) = '' then
    campaign_name := case
      when tg_table_name = 'ch_directors_ro' then 'first_letter_ro_director'
      else 'first_letter_non_ro_director'
    end;

    base_qr_url := coalesce(current_setting('app.qr_base_url', true), 'https://www.ezwebone.co.uk/guides');

    new.qr_code_link := base_qr_url
      || '?UTM_CAMPAIGN=' || campaign_name
      || '&UTM_SOURCE=letter'
      || '&UTM_MEDIUM=qr_code'
      || '&UTM_NICHE=' || replace(coalesce(new.industry, ''), ' ', '%20')
      || '&UTM_TITLE=' || replace(coalesce(new.company_name, ''), ' ', '%20')
      || '&UTM_TERM=' || replace(coalesce(new.director_first_name, ''), ' ', '%20')
      || '&UTM_CONTENT=' || coalesce(new.company_number, '')
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

update public.ch_directors_non_ro
set
  full_name = coalesce(nullif(full_name, ''), director_full_name),
  campaign_status = coalesce(nullif(campaign_status, ''), 'to_send');

update public.ch_directors_ro
set
  full_name = coalesce(nullif(full_name, ''), director_full_name),
  campaign_status = coalesce(nullif(campaign_status, ''), 'to_send');

create unique index if not exists idx_ch_directors_non_ro_download_code_unique
  on public.ch_directors_non_ro (download_code)
  where download_code is not null;

create unique index if not exists idx_ch_directors_ro_download_code_unique
  on public.ch_directors_ro (download_code)
  where download_code is not null;
