do $$
begin
  if to_regclass('public."logs-eduarddev"') is not null then
    insert into public.logs (
      created_at,
      occurred_at,
      updated_at,
      session_id,
      source_site,
      lead_id,
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
      country,
      region,
      city,
      user_agent,
      ip_hash,
      metadata
    )
    select
      coalesce(nullif(event_item->>'occurred_at', '')::timestamptz, src.created_at, now()) as created_at,
      coalesce(
        nullif(event_item->>'occurred_at', '')::timestamptz,
        src.occurred_at,
        src.created_at,
        now()
      ) as occurred_at,
      now() as updated_at,
      src.session_id,
      'eduard-dev' as source_site,
      null as lead_id,
      coalesce(nullif(event_item->>'event_name', ''), src.event_name, 'page_view') as event_name,
      coalesce(nullif(event_item->>'event_type', ''), src.event_type, 'page_view') as event_type,
      nullif(event_item->>'page_url', '') as page_url,
      nullif(event_item->>'page_path', '') as page_path,
      nullif(event_item->>'referrer', '') as referrer,
      nullif(event_item->>'utm_source', '') as utm_source,
      nullif(event_item->>'utm_medium', '') as utm_medium,
      nullif(event_item->>'utm_campaign', '') as utm_campaign,
      nullif(event_item->>'utm_term', '') as utm_term,
      nullif(event_item->>'utm_content', '') as utm_content,
      coalesce(nullif(event_item->>'device_type', ''), src.device_type, 'unknown') as device_type,
      nullif(event_item->>'browser', '') as browser,
      nullif(event_item->>'os', '') as os,
      case
        when jsonb_typeof(event_item->'viewport_width') = 'number'
          then (event_item->>'viewport_width')::integer
        else src.viewport_width
      end as viewport_width,
      case
        when jsonb_typeof(event_item->'viewport_height') = 'number'
          then (event_item->>'viewport_height')::integer
        else src.viewport_height
      end as viewport_height,
      nullif(event_item->>'language', '') as language,
      nullif(event_item->>'timezone', '') as timezone,
      null as country,
      null as region,
      null as city,
      nullif(event_item->>'user_agent', '') as user_agent,
      null as ip_hash,
      case
        when jsonb_typeof(event_item->'metadata') = 'object'
          then event_item->'metadata'
        else src.metadata
      end as metadata
    from public."logs-eduarddev" as src
    cross join lateral jsonb_array_elements(
      case
        when jsonb_typeof(src.events) = 'array' and jsonb_array_length(src.events) > 0 then src.events
        else jsonb_build_array(
          jsonb_strip_nulls(
            jsonb_build_object(
              'event_name', src.event_name,
              'event_type', src.event_type,
              'occurred_at', src.occurred_at,
              'page_url', src.page_url,
              'page_path', src.page_path,
              'referrer', src.referrer,
              'utm_source', src.utm_source,
              'utm_medium', src.utm_medium,
              'utm_campaign', src.utm_campaign,
              'utm_term', src.utm_term,
              'utm_content', src.utm_content,
              'device_type', src.device_type,
              'browser', src.browser,
              'os', src.os,
              'viewport_width', src.viewport_width,
              'viewport_height', src.viewport_height,
              'language', src.language,
              'timezone', src.timezone,
              'user_agent', src.user_agent,
              'metadata', src.metadata
            )
          )
        )
      end
    ) as event_item
    where not exists (
      select 1
      from public.logs as existing
      where existing.session_id = src.session_id
        and existing.event_name = coalesce(nullif(event_item->>'event_name', ''), src.event_name, 'page_view')
        and existing.occurred_at = coalesce(
          nullif(event_item->>'occurred_at', '')::timestamptz,
          src.occurred_at,
          src.created_at,
          now()
        )
    );
  end if;
end $$;

drop table if exists public."logs-eduarddev";

drop function if exists public.log_eduarddev_session_event(
  text, text, text, timestamptz, text, text, text, text, text, text, text, text,
  text, text, text, integer, integer, text, text, text, jsonb, jsonb
);

drop function if exists public.set_logs_eduarddev_updated_at();
