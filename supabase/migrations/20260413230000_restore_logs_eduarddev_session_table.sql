create extension if not exists pgcrypto;

create table if not exists public."logs-eduarddev" (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz not null default now(),
  last_event_at timestamptz not null default now(),

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

  metadata jsonb not null default '{}'::jsonb,
  event_count integer not null default 0,
  events jsonb not null default '[]'::jsonb,
  chat_transcript jsonb not null default '[]'::jsonb
);

comment on table public."logs-eduarddev" is
  'Portfolio analytics and chat interaction logs for eduard-dev.io, aggregated to one row per session.';

create unique index if not exists idx_logs_eduarddev_session_id_unique
  on public."logs-eduarddev" (session_id);
create index if not exists idx_logs_eduarddev_last_event_at
  on public."logs-eduarddev" (last_event_at desc);
create index if not exists idx_logs_eduarddev_events_gin
  on public."logs-eduarddev" using gin (events);
create index if not exists idx_logs_eduarddev_chat_transcript_gin
  on public."logs-eduarddev" using gin (chat_transcript);

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

create or replace function public.log_eduarddev_session_event(
  p_session_id text,
  p_event_name text,
  p_event_type text default null,
  p_occurred_at timestamptz default now(),
  p_page_url text default null,
  p_page_path text default null,
  p_referrer text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_term text default null,
  p_utm_content text default null,
  p_device_type text default 'unknown',
  p_browser text default null,
  p_os text default null,
  p_viewport_width integer default null,
  p_viewport_height integer default null,
  p_language text default null,
  p_timezone text default null,
  p_user_agent text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_chat_turn jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_occurred_at timestamptz := coalesce(p_occurred_at, now());
  v_event_type text := coalesce(nullif(p_event_type, ''), p_event_name);
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_chat_turn jsonb := case
    when p_chat_turn is null then null
    else jsonb_strip_nulls(p_chat_turn)
  end;
  v_event jsonb;
begin
  if p_session_id is null or btrim(p_session_id) = '' then
    raise exception 'session_id is required';
  end if;

  if p_event_name is null or btrim(p_event_name) = '' then
    raise exception 'event_name is required';
  end if;

  v_event := jsonb_strip_nulls(
    jsonb_build_object(
      'event_name', p_event_name,
      'event_type', v_event_type,
      'occurred_at', v_occurred_at,
      'page_url', p_page_url,
      'page_path', p_page_path,
      'referrer', p_referrer,
      'utm_source', p_utm_source,
      'utm_medium', p_utm_medium,
      'utm_campaign', p_utm_campaign,
      'utm_term', p_utm_term,
      'utm_content', p_utm_content,
      'device_type', p_device_type,
      'browser', p_browser,
      'os', p_os,
      'viewport_width', p_viewport_width,
      'viewport_height', p_viewport_height,
      'language', p_language,
      'timezone', p_timezone,
      'user_agent', p_user_agent,
      'metadata', v_metadata
    )
  );

  insert into public."logs-eduarddev" as logs (
    created_at,
    occurred_at,
    updated_at,
    started_at,
    last_event_at,
    session_id,
    event_name,
    event_type,
    page_url,
    page_path,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    device_type,
    browser,
    os,
    viewport_width,
    viewport_height,
    language,
    timezone,
    user_agent,
    metadata,
    event_count,
    events,
    chat_transcript
  )
  values (
    now(),
    v_occurred_at,
    now(),
    v_occurred_at,
    v_occurred_at,
    p_session_id,
    p_event_name,
    v_event_type,
    p_page_url,
    p_page_path,
    p_referrer,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_utm_term,
    p_utm_content,
    p_device_type,
    p_browser,
    p_os,
    p_viewport_width,
    p_viewport_height,
    p_language,
    p_timezone,
    p_user_agent,
    v_metadata,
    1,
    jsonb_build_array(v_event),
    case
      when v_chat_turn is null then '[]'::jsonb
      else jsonb_build_array(v_chat_turn)
    end
  )
  on conflict (session_id) do update
  set
    occurred_at = excluded.occurred_at,
    updated_at = now(),
    started_at = least(logs.started_at, excluded.started_at),
    last_event_at = greatest(logs.last_event_at, excluded.last_event_at),
    event_name = excluded.event_name,
    event_type = excluded.event_type,
    page_url = coalesce(excluded.page_url, logs.page_url),
    page_path = coalesce(excluded.page_path, logs.page_path),
    referrer = coalesce(logs.referrer, excluded.referrer),
    utm_source = coalesce(logs.utm_source, excluded.utm_source),
    utm_medium = coalesce(logs.utm_medium, excluded.utm_medium),
    utm_campaign = coalesce(logs.utm_campaign, excluded.utm_campaign),
    utm_term = coalesce(logs.utm_term, excluded.utm_term),
    utm_content = coalesce(logs.utm_content, excluded.utm_content),
    device_type = case
      when excluded.device_type is null or excluded.device_type = 'unknown'
        then logs.device_type
      else excluded.device_type
    end,
    browser = coalesce(excluded.browser, logs.browser),
    os = coalesce(excluded.os, logs.os),
    viewport_width = coalesce(excluded.viewport_width, logs.viewport_width),
    viewport_height = coalesce(excluded.viewport_height, logs.viewport_height),
    language = coalesce(excluded.language, logs.language),
    timezone = coalesce(excluded.timezone, logs.timezone),
    user_agent = coalesce(excluded.user_agent, logs.user_agent),
    metadata = coalesce(logs.metadata, '{}'::jsonb) || v_metadata,
    event_count = coalesce(logs.event_count, 0) + 1,
    events = coalesce(logs.events, '[]'::jsonb) || jsonb_build_array(v_event),
    chat_transcript = case
      when v_chat_turn is null then coalesce(logs.chat_transcript, '[]'::jsonb)
      else coalesce(logs.chat_transcript, '[]'::jsonb) || jsonb_build_array(v_chat_turn)
    end;
end;
$$;

revoke all on function public.log_eduarddev_session_event(
  text, text, text, timestamptz, text, text, text, text, text, text, text, text,
  text, text, text, integer, integer, text, text, text, jsonb, jsonb
) from public;

grant execute on function public.log_eduarddev_session_event(
  text, text, text, timestamptz, text, text, text, text, text, text, text, text,
  text, text, text, integer, integer, text, text, text, jsonb, jsonb
) to anon;

grant execute on function public.log_eduarddev_session_event(
  text, text, text, timestamptz, text, text, text, text, text, text, text, text,
  text, text, text, integer, integer, text, text, text, jsonb, jsonb
) to authenticated;
