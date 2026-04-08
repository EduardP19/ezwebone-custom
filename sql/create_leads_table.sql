-- Leads table for contact and enquiry submissions.
-- Run in Supabase SQL Editor or via a DB client.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id text null,
  first_name text not null,
  last_name text null,
  email text not null,
  phone text null,
  business_name text null,
  service_interest text null,
  message text null,
  source_page text not null default 'Direct Contact',
  source text null,
  campaign text null,
  medium text null,
  session_id text null,
  country text null,
  user_agent text null,
  has_website boolean null,
  niche text null,
  company_number text null,
  discount text null,
  submissions integer not null default 1,
  first_seen_at timestamptz not null default now(),
  last_submitted_at timestamptz not null default now(),
  agent_key text null,
  transcript_session_id text null,
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb
);

alter table public.leads add column if not exists created_at timestamptz not null default now();
alter table public.leads add column if not exists updated_at timestamptz not null default now();
alter table public.leads add column if not exists lead_id text;
alter table public.leads add column if not exists first_name text;
alter table public.leads add column if not exists last_name text;
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists business_name text;
alter table public.leads add column if not exists service_interest text;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists source_page text not null default 'Direct Contact';
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists campaign text;
alter table public.leads add column if not exists medium text;
alter table public.leads add column if not exists session_id text;
alter table public.leads add column if not exists country text;
alter table public.leads add column if not exists user_agent text;
alter table public.leads add column if not exists has_website boolean;
alter table public.leads add column if not exists niche text;
alter table public.leads add column if not exists company_number text;
alter table public.leads add column if not exists discount text;
alter table public.leads add column if not exists submissions integer not null default 1;
alter table public.leads add column if not exists first_seen_at timestamptz not null default now();
alter table public.leads add column if not exists last_submitted_at timestamptz not null default now();
alter table public.leads add column if not exists agent_key text;
alter table public.leads add column if not exists transcript_session_id text;
alter table public.leads add column if not exists status text not null default 'new';
alter table public.leads add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_email on public.leads (email);
create index if not exists idx_leads_email_lower on public.leads (lower(email));
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_source_page on public.leads (source_page);
create index if not exists idx_leads_campaign on public.leads (campaign);
create index if not exists idx_leads_session_id on public.leads (session_id);
create index if not exists idx_leads_transcript_session_id on public.leads (transcript_session_id);

create or replace function public.set_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
before update on public.leads
for each row
execute function public.set_leads_updated_at();

alter table public.leads enable row level security;

drop policy if exists "Allow public insert" on public.leads;
create policy "Allow public insert"
on public.leads
for insert
to anon
with check (true);

drop policy if exists "Allow authenticated read access to leads" on public.leads;
create policy "Allow authenticated read access to leads"
on public.leads
for select
to authenticated
using (true);
