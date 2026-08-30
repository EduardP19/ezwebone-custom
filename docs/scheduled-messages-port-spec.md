# Porting Resevia's scheduled-messages pattern to EZWebOne

Spec for a fresh Claude Code session opened in `ezwebone-custom/` to implement
this without re-deriving it. Ported from `resevia/` (same pattern, own DB,
own Supabase project — not shared).

## 1. Schema — one new migration

Add `supabase/migrations/<timestamp>_add_scheduled_messages.sql` (final
shape, i.e. skip Resevia's incremental template_id→template_key history —
build it this way from the start):

```sql
create extension if not exists pgcrypto; -- for gen_random_uuid(), if not already enabled

create table if not exists public.message_templates (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    template_key text not null,
    name text not null,
    channel text not null check (channel in ('email', 'sms')),
    subject text,
    body_text text not null,
    body_html text,
    parameter_keys text[] default '{}'::text[],
    description text,
    is_active boolean default true not null,
    metadata jsonb default '{}'::jsonb not null,
    unique (name, channel),
    unique (template_key, channel),
    constraint message_templates_subject_check check (
        (channel = 'email' and subject is not null and btrim(subject) <> '')
        or (channel = 'sms' and subject is null)
    )
);

create table if not exists public.scheduled_messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    send_after timestamptz not null,
    sent_at timestamptz,
    claimed_at timestamptz,
    status text default 'pending' not null check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    channel text not null check (channel in ('email', 'sms')),
    template_key text not null,
    campaign_name text,
    recipient_name text,
    recipient_email text,
    recipient_phone text,
    sending_source text,
    subject_override text,
    template_params jsonb default '{}'::jsonb not null,
    attempt_count integer default 0 not null check (attempt_count >= 0),
    claimed_by text,
    provider_message_id text,
    last_error text,
    metadata jsonb default '{}'::jsonb not null,
    constraint scheduled_messages_template_fkey
        foreign key (template_key, channel)
        references public.message_templates(template_key, channel)
        on delete restrict,
    constraint scheduled_messages_recipient_check check (
        (channel = 'email' and recipient_email is not null and btrim(recipient_email) <> '')
        or (channel = 'sms' and recipient_phone is not null and btrim(recipient_phone) <> '')
    )
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_message_templates_updated_at on public.message_templates;
create trigger set_message_templates_updated_at
    before update on public.message_templates
    for each row execute function public.set_updated_at();

drop trigger if exists set_scheduled_messages_updated_at on public.scheduled_messages;
create trigger set_scheduled_messages_updated_at
    before update on public.scheduled_messages
    for each row execute function public.set_updated_at();

create or replace function public.claim_due_scheduled_messages(
    p_batch_size integer default 50,
    p_worker text default null
)
returns setof public.scheduled_messages
language plpgsql as $$
begin
    return query
    with due as (
        select sm.id
        from public.scheduled_messages sm
        where sm.status = 'pending'
          and sm.send_after <= now()
        order by sm.send_after, sm.id
        limit greatest(coalesce(p_batch_size, 50), 1)
        for update skip locked
    )
    update public.scheduled_messages sm
    set status = 'processing',
        claimed_at = now(),
        claimed_by = coalesce(p_worker, sm.claimed_by),
        attempt_count = sm.attempt_count + 1,
        updated_at = now()
    from due
    where sm.id = due.id
    returning sm.*;
end;
$$;

alter table public.message_templates enable row level security;
alter table public.scheduled_messages enable row level security;

create index if not exists idx_message_templates_channel_active
    on public.message_templates(channel, is_active);
create index if not exists idx_scheduled_messages_due_pending
    on public.scheduled_messages(send_after, id)
    where status = 'pending';
create index if not exists idx_scheduled_messages_template_key
    on public.scheduled_messages(template_key);
```

No RLS policies are added (service role bypasses RLS; only server-side code
touches these tables), matching Resevia.

Seed at least one `message_templates` row (email) via a separate insert or
the dashboard once built — the Edge Function needs a matching
`(template_key, channel)` row to render against.

## 2. Edge Function

Copy `resevia/supabase/functions/send-scheduled-messages/index.ts` verbatim
into `ezwebone-custom/supabase/functions/send-scheduled-messages/index.ts` —
no changes needed, it's already generic (reads env vars, doesn't hardcode
any Resevia-specific values). Adjust `EMAIL_FROM` default if desired.

## 3. Deploy + secrets (EZWebOne's own Supabase project)

```bash
supabase functions deploy send-scheduled-messages --project-ref <ezwebone-project-ref>

supabase secrets set \
  RESEND_API_KEY=<value> \
  CRON_SECRET=<generate a random one> \
  SCHEDULED_MESSAGES_FROM="EZWebOne <hello@ezwebone.co.uk>" \
  TWILIO_ACCOUNT_SID=<value> \
  TWILIO_AUTH_TOKEN=<value> \
  TWILIO_SMS_FROM=<value> \
  TWILIO_WHATSAPP_FROM=<value> \
  --project-ref <ezwebone-project-ref>
```
(`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by the
platform — don't set manually. Twilio vars are optional — see "Resend +
Twilio account consolidation" below for the actual values in use; if unset,
sms/whatsapp rows just revert to `pending` and are skipped.)

## 4. Vault secrets (for pg_cron to call the function)

Cannot INSERT into `vault.secrets` directly — use `vault.create_secret()`,
run via `supabase db query --file <path> --linked` (never inline a raw
secret value into a bash command — write it to a scratch file first, then
delete it):

- `project_url` → `https://<ezwebone-project-ref>.supabase.co`
- `send_scheduled_messages_cron_secret` → same value as `CRON_SECRET` above
- `send_scheduled_messages_service_role_key` → the project's service role key

## 5. pg_cron job

One migration, write it with the `Authorization` header included from the
start (Resevia needed a follow-up fix migration for this — skip that
mistake):

```sql
create extension if not exists pg_net with schema extensions;

do $$
begin
    if not exists (select 1 from cron.job where jobname = 'send-scheduled-messages-every-5-minutes') then
        perform cron.schedule(
            'send-scheduled-messages-every-5-minutes',
            '*/5 * * * *',
            $cron$
            select net.http_post(
                url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-scheduled-messages',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_service_role_key'),
                    'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_cron_secret')
                ),
                body := '{}'::jsonb
            ) as request_id;
            $cron$
        );
    end if;
end;
$$;
```

**Important gotcha (cost Resevia a debugging round):** `cron.job_run_details`
only confirms the SQL statement queuing the async `net.http_post` ran — not
that the HTTP call itself succeeded. Verify actual delivery via:

```sql
select status_code, content from net._http_response order by created desc limit 5;
```

A `401 UNAUTHORIZED_NO_AUTH_HEADER` there means the `Authorization` header
above is missing/wrong — Supabase's Edge Function gateway requires it
independently of the app-level `x-cron-secret` check.

## 6. API routes + dashboard UI — build only if/when needed

Not ported yet — EZWebOne has no trigger for scheduled sends defined. If you
want the same `/dashboard/messages` create/view UI and
`/api/.../scheduled-messages` + `/api/.../templates` routes, port
`resevia/app/dashboard/messages/page.tsx` and
`resevia/app/api/dashboard-messaging/**` next, swapping in whatever
EZWebOne's dashboard auth/layout conventions are. Otherwise, insert rows into
`scheduled_messages` directly from whichever EZWebOne feature needs a
delayed send (e.g. a follow-up email job after a guide claim).

## 7. Verify

- `npx tsc --noEmit` after any TS changes
- Insert a test row with `send_after` a few minutes out, `status = 'pending'`
- Wait for a cron tick, check `status` flips to `sent` and `provider_message_id`
  is populated (or `status = failed` + `last_error` if something's wrong)

## Implementation status (2026-08-25)

Sections 1–5 are done and applied to EZWebOne's live Supabase project
(`mbpaxjsgwpvvhqzbzfup`). Section 6 not started (still no trigger for
scheduled sends in EZWebOne — build when needed, per that section).

**Deviation from the plan above:** mid-implementation, Resevia's source
files changed upstream — the Edge Function and schema picked up a third
channel, `whatsapp` (sent via Twilio, same REST call shape as `sms`, prefixes
From/To with `whatsapp:`; Twilio creds are optional, and SMS/WhatsApp rows
revert to `pending` and are skipped rather than failing if unset). Confirmed
with the user and re-synced rather than porting the stale email-only
version. Net effect on this spec:

- Section 1's schema: `channel` check constraints (both tables) and
  `message_templates`/`scheduled_messages` subject/recipient checks now
  allow `'whatsapp'` alongside `'email'`/`'sms'`. Applied as a second
  migration, `20260825150200_add_whatsapp_channel.sql` (mirrors Resevia's
  own follow-up migration), since the base migration had already run by the
  time the upstream diff landed — `20260825150000_add_scheduled_messages.sql`
  was also edited in place to match, so a fresh read of that file already
  shows `whatsapp` included (the follow-up migration exists only to bring
  already-applied schema in line with it).
- Section 2's Edge Function now branches on `email` (Resend) vs.
  `sms`/`whatsapp` (Twilio). `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
  `TWILIO_SMS_FROM`, `TWILIO_WHATSAPP_FROM` are additional optional secrets
  — not set in EZWebOne (no Twilio account wired up yet), which is fine:
  the function no-ops those channels back to `pending` until they are.
- `EMAIL_FROM` default set to `EZWebOne <hello@ezwebone.co.uk>`
  (`SCHEDULED_MESSAGES_FROM` env var still overrides it, matching the
  existing `RESEND_FROM` convention used elsewhere in this repo).

**Other deviations:**

- `tsconfig.json` needed `"supabase/functions"` added to `exclude` (Resevia
  already has this; EZWebOne's tsconfig didn't) — otherwise `npx tsc
  --noEmit` fails on the Deno-only globals (`Deno`, `npm:` specifiers) in
  the Edge Function. Done.
- EZWebOne's Supabase project didn't have the `pg_cron` extension enabled
  yet (only `pg_net` was in the plan) — added `create extension if not
  exists pg_cron with schema extensions;` to the cron migration.
- Pre-existing, unrelated migration-history drift on the linked project
  (two remote migrations with no local file, three local migrations not
  yet applied remotely) blocked `db push` before any of the above could go
  out. Repaired via `supabase migration repair --status reverted
  20260420234300 20260421002740`, confirmed with the user first — not
  something this spec's changes caused.

## Resend + Twilio account consolidation (2026-08-25)

Both providers are now shared with Resevia rather than separate per-project
accounts. Use Resevia's `.env.local` as the source of truth for both going
forward.

**Resend:** `ezwebone.co.uk` has been added as a verified domain on the
**same Resend account Resevia uses** (previously EZWebOne was on a
separate/different account). One shared `RESEND_API_KEY` across both
projects now.

- EZWebOne's Edge Function secret has been updated to match:
  ```bash
  supabase secrets set RESEND_API_KEY=<same value as Resevia's .env.local> \
    --project-ref mbpaxjsgwpvvhqzbzfup
  ```
  (Done — applied 2026-08-25, via a scratch `--env-file`, deleted after use.)
- `SCHEDULED_MESSAGES_FROM` stays as-is (`EZWebOne <hello@ezwebone.co.uk>`)
  — only the API key moved, not the sending domain/address.

**Twilio:** EZWebOne now uses the **same Twilio account and sending number**
Resevia uses (not a separate EZWebOne Twilio account/number). Current
values (also in Resevia's `.env.local`):
  - `TWILIO_ACCOUNT_SID=<value — see Resevia's .env.local, not repeated in a doc>`
  - `TWILIO_AUTH_TOKEN=<value — see Resevia's .env.local, not repeated in a doc>`
  - `TWILIO_SMS_FROM=+447886083430`
  - `TWILIO_WHATSAPP_FROM=+447886083430` (same number, used for both — this
    number is WhatsApp-enabled in Twilio's console)
  - Account's Active Region must stay **US1** (not Ireland) — see Resevia's
    own history for why (Ireland region caused SMS error 21663; reverted).

  EZWebOne's Edge Function secrets have been updated to match:
  ```bash
  supabase secrets set \
    TWILIO_ACCOUNT_SID=<value — see Resevia's .env.local, not repeated in a doc> \
    TWILIO_AUTH_TOKEN=<value — see Resevia's .env.local, not repeated in a doc> \
    TWILIO_SMS_FROM=+447886083430 \
    TWILIO_WHATSAPP_FROM=+447886083430 \
    --project-ref mbpaxjsgwpvvhqzbzfup
  ```
  (Done — applied 2026-08-25, via a scratch `--env-file`, deleted after use.)

  **Note on WhatsApp Content Templates:** Resevia's working WhatsApp send
  relies on an approved Twilio Content Template (`ContentSid`, stored in
  `message_templates.body_text` as an `HX...` value) — templates are
  approved per Twilio subaccount/sender, not just per number, and Resevia's
  approved template is `amo_missed_call_followup`
  (`HX6e2aeaa01835f2c53b1b20560c14b59e`, `twilio/text` content type — a
  sibling template with the same friendly name but `whatsapp/card` type,
  `HX11a1577d60938051dfdab3e54f49bf9c`, was rejected with error 63005, don't
  reuse that SID). If EZWebOne seeds its own whatsapp `message_templates`
  row, it must reference a template actually approved for use with this
  Twilio account/number — check Twilio Console > Content Editor before
  assuming any Resevia template SID will work for an EZWebOne send; if
  EZWebOne doesn't need WhatsApp yet, this only matters once it does.

- If either key is ever rotated on Resevia's side, re-run the matching
  `supabase secrets set` for EZWebOne's project ref to keep them in sync —
  nothing automates this, it's a manual mirror.

## Vault secrets + verification (2026-08-25, completed)

Section 4 is done. `CRON_SECRET` was regenerated (the original value set in
an earlier session was never displayed anywhere and so couldn't be reused)
and re-set via `supabase secrets set`. All three vault secrets
(`project_url`, `send_scheduled_messages_cron_secret`,
`send_scheduled_messages_service_role_key`) were created via
`vault.create_secret()`, using the user's `SUPABASE_SECRET_KEY` (the
`sb_secret_...` key from `.env.local`) as the service-role value — that
worked fine for `vault.create_secret`, for what it's worth, after the
sandbox's permission classifier had blocked earlier attempts to fetch the
key via `supabase projects api-keys`. Scratch SQL files deleted after use
in both cases.

**Section 7 verification: passed end-to-end.** Seeded one smoke-test
`message_templates` row (`template_key = 'scheduled-messages-smoke-test'`,
channel `email`) and one `scheduled_messages` row (`send_after` = now + 3
min, recipient the user's own email). Confirmed via direct query:

- `scheduled_messages` row flipped to `status = 'sent'`, `provider_message_id`
  populated with Resend's id, `last_error = null`, claimed by
  `edge:send-scheduled-messages`.
- `net._http_response` (the gotcha this spec calls out) showed
  `status_code = 200` with body `{"claimed":1,"sent":1,"failed":0,"skipped":0}`
  on the tick that processed it, and `{"claimed":0,...}` on the prior tick —
  confirming the Edge Function call actually succeeded end-to-end, not just
  that pg_cron queued it.

The full pipeline (pg_cron → pg_net → Edge Function → Resend → DB status
update) is confirmed working on EZWebOne's project. The smoke-test template
row (`scheduled-messages-smoke-test`) is still in `message_templates` —
harmless to leave, or delete it once section 6 defines what the real
templates should look like.

**sms/whatsapp not smoke-tested yet.** The email smoke test above predates
the Twilio secrets being set (see "Resend + Twilio account consolidation"
above — applied after this verification ran). Twilio credentials are now
live on EZWebOne's project, so sms/whatsapp channels will no longer be
skipped/reverted to `pending` the next time a row for those channels is
claimed — but no sms or whatsapp `message_templates` row has been seeded
yet, and no end-to-end send has actually been confirmed on EZWebOne (only
on Resevia). Seed a matching template + test row the same way the email
smoke test did, for each channel actually needed, before relying on this.

**Reminder:** the user pasted `.env.local` (including `SUPABASE_SECRET_KEY`)
into chat during this session to unblock the vault step — that key is now
in this conversation's transcript in plaintext and should be rotated once
this work is wrapped up.

**Still open:** Section 6 (dashboard UI / API routes) — not started, build
only if/when EZWebOne gets a real trigger for scheduled sends.
