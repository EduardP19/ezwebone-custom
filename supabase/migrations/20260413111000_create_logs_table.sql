create extension if not exists pgcrypto;

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  session_id text not null,
  source_site text not null default 'ezwebone' check (source_site in ('ezwebone', 'eduard-dev')),
  lead_id uuid null,

  event_name text not null default 'page_view',
  event_type text not null default 'page_view',

  page_url text null,
  page_path text null,
  referrer text null,

  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,

  device_type text not null default 'unknown',
  browser text null,
  os text null,
  viewport_width integer null,
  viewport_height integer null,
  language text null,
  timezone text null,

  country text null,
  region text null,
  city text null,

  user_agent text null,
  ip_hash text null,

  metadata jsonb not null default '{}'::jsonb
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'id'
      and udt_name = 'uuid'
  ) then
    begin
      alter table public.logs
        add constraint logs_lead_id_fkey
        foreign key (lead_id) references public.leads(id) on delete set null;
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;

create index if not exists idx_logs_created_at on public.logs (created_at desc);
create index if not exists idx_logs_occurred_at on public.logs (occurred_at desc);
create index if not exists idx_logs_session_id on public.logs (session_id);
create index if not exists idx_logs_event_name on public.logs (event_name);
create index if not exists idx_logs_event_type on public.logs (event_type);
create index if not exists idx_logs_source_site on public.logs (source_site);
create index if not exists idx_logs_lead_id on public.logs (lead_id);
create index if not exists idx_logs_utm_source on public.logs (utm_source);
create index if not exists idx_logs_utm_campaign on public.logs (utm_campaign);
create index if not exists idx_logs_page_path on public.logs (page_path);
create index if not exists idx_logs_metadata_gin on public.logs using gin (metadata);

create or replace function public.set_logs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_logs_updated_at on public.logs;
create trigger trg_logs_updated_at
before update on public.logs
for each row
execute function public.set_logs_updated_at();

alter table public.logs enable row level security;

revoke all on table public.logs from anon;
revoke all on table public.logs from authenticated;

grant insert on table public.logs to anon;
grant insert on table public.logs to authenticated;

drop policy if exists logs_insert_anon on public.logs;
create policy logs_insert_anon
on public.logs
for insert
to anon
with check (true);

drop policy if exists logs_insert_authenticated on public.logs;
create policy logs_insert_authenticated
on public.logs
for insert
to authenticated
with check (true);
