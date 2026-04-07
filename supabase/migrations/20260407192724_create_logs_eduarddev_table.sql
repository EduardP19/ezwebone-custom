create extension if not exists pgcrypto;

create table if not exists public."logs-eduarddev" (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  session_id text not null,
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
  user_agent text null,

  metadata jsonb not null default '{}'::jsonb
);

comment on table public."logs-eduarddev" is
  'Portfolio analytics and chat interaction logs for eduard-dev.io.';

create index if not exists idx_logs_eduarddev_created_at
  on public."logs-eduarddev" (created_at desc);
create index if not exists idx_logs_eduarddev_occurred_at
  on public."logs-eduarddev" (occurred_at desc);
create index if not exists idx_logs_eduarddev_session_id
  on public."logs-eduarddev" (session_id);
create index if not exists idx_logs_eduarddev_event_name
  on public."logs-eduarddev" (event_name);
create index if not exists idx_logs_eduarddev_event_type
  on public."logs-eduarddev" (event_type);
create index if not exists idx_logs_eduarddev_page_path
  on public."logs-eduarddev" (page_path);
create index if not exists idx_logs_eduarddev_metadata_gin
  on public."logs-eduarddev" using gin (metadata);

create or replace function public.set_logs_eduarddev_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_logs_eduarddev_updated_at on public."logs-eduarddev";
create trigger trg_logs_eduarddev_updated_at
before update on public."logs-eduarddev"
for each row
execute function public.set_logs_eduarddev_updated_at();

alter table public."logs-eduarddev" enable row level security;

revoke all on table public."logs-eduarddev" from anon;
revoke all on table public."logs-eduarddev" from authenticated;

grant insert on table public."logs-eduarddev" to anon;
grant insert on table public."logs-eduarddev" to authenticated;

drop policy if exists logs_eduarddev_insert_anon on public."logs-eduarddev";
create policy logs_eduarddev_insert_anon
on public."logs-eduarddev"
for insert
to anon
with check (true);

drop policy if exists logs_eduarddev_insert_authenticated on public."logs-eduarddev";
create policy logs_eduarddev_insert_authenticated
on public."logs-eduarddev"
for insert
to authenticated
with check (true);
