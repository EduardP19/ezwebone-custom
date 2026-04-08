create table if not exists public.guide_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text not null,
  first_name text not null,
  email text not null,
  source text not null check (source in ('non_ro', 'ro')),
  source_table text not null check (source_table in ('ch_directors_non_ro', 'ch_directors_ro')),
  source_row_id uuid not null,
  company_number text not null,
  company_name text not null,
  director_full_name text not null
);

create index if not exists idx_guide_leads_code on public.guide_leads (code);
create index if not exists idx_guide_leads_email on public.guide_leads (email);
create index if not exists idx_guide_leads_created_at on public.guide_leads (created_at desc);
