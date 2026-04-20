-- We no longer use a separate guide_leads table/view.
-- Guide claim events are stored in public.leads (with metadata for attribution).

drop view if exists public.guide_leads_with_recipient_status;
drop table if exists public.guide_leads;

-- Ensure the lead_id we generate in code is unique in Supabase too.
-- (Unique index allows multiple NULLs; we still keep lead_id nullable for backward compatibility.)
create unique index if not exists idx_leads_lead_id_unique
  on public.leads (lead_id)
  where lead_id is not null;

