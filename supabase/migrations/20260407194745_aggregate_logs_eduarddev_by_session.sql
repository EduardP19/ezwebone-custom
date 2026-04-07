alter table public."logs-eduarddev"
  add column if not exists started_at timestamptz not null default now(),
  add column if not exists last_event_at timestamptz not null default now(),
  add column if not exists event_count integer not null default 0,
  add column if not exists events jsonb not null default '[]'::jsonb,
  add column if not exists chat_transcript jsonb not null default '[]'::jsonb;

create temporary table tmp_logs_eduarddev_aggregated on commit drop as
with base as (
  select
    id,
    created_at,
    occurred_at,
    updated_at,
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
    row_number() over (
      partition by session_id
      order by occurred_at desc nulls last, created_at desc nulls last, id desc
    ) as rn
  from public."logs-eduarddev"
),
aggregated as (
  select
    session_id,
    min(created_at) as created_at,
    min(coalesce(occurred_at, created_at)) as started_at,
    max(coalesce(occurred_at, created_at)) as last_event_at,
    max(updated_at) as updated_at,
    count(*)::integer as event_count,
    coalesce(
      jsonb_agg(
        jsonb_strip_nulls(
          jsonb_build_object(
            'event_name', event_name,
            'event_type', event_type,
            'occurred_at', occurred_at,
            'page_url', page_url,
            'page_path', page_path,
            'referrer', referrer,
            'utm_source', utm_source,
            'utm_medium', utm_medium,
            'utm_campaign', utm_campaign,
            'utm_term', utm_term,
            'utm_content', utm_content,
            'device_type', device_type,
            'browser', browser,
            'os', os,
            'viewport_width', viewport_width,
            'viewport_height', viewport_height,
            'language', language,
            'timezone', timezone,
            'user_agent', user_agent,
            'metadata', metadata
          )
        )
        order by occurred_at asc nulls last, created_at asc nulls last, id asc
      ),
      '[]'::jsonb
    ) as events
  from base
  group by session_id
),
chat as (
  select
    session_id,
    coalesce(
      jsonb_agg(
        jsonb_strip_nulls(
          jsonb_build_object(
            'role',
            case
              when event_name = 'chat_prompt' then 'user'
              when event_name = 'chat_reply' then 'assistant'
              else null
            end,
            'occurred_at', occurred_at,
            'content', nullif(metadata->>'message', ''),
            'source', nullif(metadata->>'reply_source', '')
          )
        )
        order by occurred_at asc nulls last, created_at asc nulls last, id asc
      ) filter (
        where event_name in ('chat_prompt', 'chat_reply')
          and coalesce(metadata->>'message', '') <> ''
      ),
      '[]'::jsonb
    ) as chat_transcript
  from base
  group by session_id
)
select
  gen_random_uuid() as id,
  aggregated.created_at,
  aggregated.last_event_at as occurred_at,
  greatest(aggregated.updated_at, aggregated.last_event_at) as updated_at,
  aggregated.started_at,
  aggregated.last_event_at,
  aggregated.session_id,
  latest.event_name,
  latest.event_type,
  latest.page_url,
  latest.page_path,
  latest.referrer,
  latest.utm_source,
  latest.utm_medium,
  latest.utm_campaign,
  latest.utm_term,
  latest.utm_content,
  latest.device_type,
  latest.browser,
  latest.os,
  latest.viewport_width,
  latest.viewport_height,
  latest.language,
  latest.timezone,
  latest.user_agent,
  latest.metadata,
  aggregated.event_count,
  aggregated.events,
  coalesce(chat.chat_transcript, '[]'::jsonb) as chat_transcript
from aggregated
join base as latest
  on latest.session_id = aggregated.session_id
 and latest.rn = 1
left join chat
  on chat.session_id = aggregated.session_id;

truncate table public."logs-eduarddev";

insert into public."logs-eduarddev" (
  id,
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
select
  id,
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
from tmp_logs_eduarddev_aggregated;

drop index if exists idx_logs_eduarddev_session_id;
create unique index if not exists idx_logs_eduarddev_session_id_unique
  on public."logs-eduarddev" (session_id);
create index if not exists idx_logs_eduarddev_last_event_at
  on public."logs-eduarddev" (last_event_at desc);
create index if not exists idx_logs_eduarddev_events_gin
  on public."logs-eduarddev" using gin (events);
create index if not exists idx_logs_eduarddev_chat_transcript_gin
  on public."logs-eduarddev" using gin (chat_transcript);

drop policy if exists logs_eduarddev_insert_anon on public."logs-eduarddev";
drop policy if exists logs_eduarddev_insert_authenticated on public."logs-eduarddev";

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
