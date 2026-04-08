alter table if exists public.guide_leads
  add column if not exists landing_url text,
  add column if not exists qr_params jsonb not null default '{}'::jsonb;

create index if not exists idx_guide_leads_qr_params_gin
  on public.guide_leads
  using gin (qr_params);
