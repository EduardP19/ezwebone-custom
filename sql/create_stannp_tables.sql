-- Tables for Stannp direct-mail workflow.
-- Run in Supabase SQL Editor or via a DB client.

create extension if not exists pgcrypto;

create table if not exists public.companies_house_campaign (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_number text not null,
  company_name text not null,
  full_name text not null,
  first_name text null,
  correspondence_address jsonb not null default '{}'::jsonb,
  company_status text null,
  status text null,
  nationality text null,
  niche text null,
  qr_code_link text null,
  run_id text null,
  sic_codes text[] not null default '{}'::text[],
  download_code text null,
  campaign_status text not null default 'to_send',
  stannp_template_id integer null,
  letter_tags text not null default 'first_send,letter',
  template_headline text null,
  template_body text null,
  template_highlight_text text null,
  template_qr_content_description text null,
  template_footer text null,
  template_privacy_notice text null,
  last_letter_sent_at timestamptz null,
  last_error text null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_companies_house_campaign_status
  on public.companies_house_campaign (campaign_status);
create index if not exists idx_companies_house_campaign_company_number
  on public.companies_house_campaign (company_number);
create index if not exists idx_companies_house_campaign_created_at
  on public.companies_house_campaign (created_at desc);

create table if not exists public.letters_sent (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  campaign_id uuid null references public.companies_house_campaign(id) on delete set null,
  company_number text null,
  letter_link text null,
  letter_id text null,
  status text null,
  cost numeric null,
  raw_response jsonb not null default '{}'::jsonb
);

create unique index if not exists idx_letters_sent_letter_id_unique
  on public.letters_sent (letter_id)
  where letter_id is not null;
create index if not exists idx_letters_sent_campaign_id
  on public.letters_sent (campaign_id);
create index if not exists idx_letters_sent_created_at
  on public.letters_sent (created_at desc);

alter table public.companies_house_campaign enable row level security;
alter table public.letters_sent enable row level security;
