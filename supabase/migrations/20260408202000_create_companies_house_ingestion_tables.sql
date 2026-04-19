create extension if not exists pgcrypto;

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

drop trigger if exists trg_ch_import_runs_updated_at on public.ch_import_runs;
create trigger trg_ch_import_runs_updated_at
before update on public.ch_import_runs
for each row
execute function public.set_ch_updated_at();

create index if not exists idx_ch_import_runs_created_at
  on public.ch_import_runs (created_at desc);

create index if not exists idx_ch_import_runs_status
  on public.ch_import_runs (status);

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
  director_full_name text not null,
  director_first_name text null,
  nationality_raw text not null default 'unknown',
  nationality_normalized text not null,
  correspondence_address jsonb not null default '{}'::jsonb,
  registered_address jsonb not null default '{}'::jsonb
);

drop trigger if exists trg_ch_directors_non_ro_updated_at on public.ch_directors_non_ro;
create trigger trg_ch_directors_non_ro_updated_at
before update on public.ch_directors_non_ro
for each row
execute function public.set_ch_updated_at();

create unique index if not exists idx_ch_directors_non_ro_unique
  on public.ch_directors_non_ro (company_number, director_full_name, nationality_raw);

create index if not exists idx_ch_directors_non_ro_run_id
  on public.ch_directors_non_ro (run_id);

create index if not exists idx_ch_directors_non_ro_nationality_normalized
  on public.ch_directors_non_ro (nationality_normalized);

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
  director_full_name text not null,
  director_first_name text null,
  nationality_raw text not null default 'unknown',
  correspondence_address jsonb not null default '{}'::jsonb,
  registered_address jsonb not null default '{}'::jsonb
);

drop trigger if exists trg_ch_directors_ro_updated_at on public.ch_directors_ro;
create trigger trg_ch_directors_ro_updated_at
before update on public.ch_directors_ro
for each row
execute function public.set_ch_updated_at();

create unique index if not exists idx_ch_directors_ro_unique
  on public.ch_directors_ro (company_number, director_full_name, nationality_raw);

create index if not exists idx_ch_directors_ro_run_id
  on public.ch_directors_ro (run_id);
