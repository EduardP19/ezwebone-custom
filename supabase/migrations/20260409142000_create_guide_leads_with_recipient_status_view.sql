create or replace view public.guide_leads_with_recipient_status as
select
  gl.id as lead_id,
  gl.created_at as lead_created_at,
  gl.code,
  gl.first_name,
  gl.email,
  gl.source,
  gl.source_table,
  gl.source_row_id,
  gl.company_number,
  gl.company_name,
  gl.director_full_name,
  gl.landing_url,
  gl.qr_params,
  coalesce(non_ro.id, ro.id) as recipient_id,
  coalesce(non_ro.campaign_status, ro.campaign_status) as recipient_campaign_status,
  coalesce(non_ro.updated_at, ro.updated_at) as recipient_updated_at,
  case
    when non_ro.id is not null then 'ch_directors_non_ro'
    when ro.id is not null then 'ch_directors_ro'
    else null
  end as matched_table
from public.guide_leads gl
left join public.ch_directors_non_ro non_ro
  on gl.source_table = 'ch_directors_non_ro'
 and gl.source_row_id = non_ro.id
left join public.ch_directors_ro ro
  on gl.source_table = 'ch_directors_ro'
 and gl.source_row_id = ro.id;
