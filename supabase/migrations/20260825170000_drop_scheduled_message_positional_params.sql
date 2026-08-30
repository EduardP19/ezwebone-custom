-- template_params (jsonb) already covers everything param1..6 did, with
-- named keys instead of positional slots and no fixed limit on count.
-- Mirrors Resevia's own drop of these columns (20260825165900) — EZWebOne's
-- schema was ported before that happened. Nothing in EZWebOne relies on the
-- positional columns yet (only the section-7 email smoke test row exists,
-- and it doesn't use them).
alter table public.scheduled_messages
    drop column if exists param1,
    drop column if exists param2,
    drop column if exists param3,
    drop column if exists param4,
    drop column if exists param5,
    drop column if exists param6;
