create table if not exists public.prequalify_transcripts (
  id bigserial primary key,
  session_id text not null unique,
  locale text not null default 'en',
  user_email text null,
  messages_used integer not null default 0 check (messages_used >= 0),
  trial_limit integer not null default 5 check (trial_limit = 5),
  trial_completed_at timestamptz null,
  report_sent_at timestamptz null,
  transcript jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_prequalify_transcripts_created_at
  on public.prequalify_transcripts (created_at desc);

create index if not exists idx_prequalify_transcripts_user_email
  on public.prequalify_transcripts (user_email);

create index if not exists idx_prequalify_transcripts_transcript_gin
  on public.prequalify_transcripts using gin (transcript);

alter table public.prequalify_transcripts enable row level security;

drop policy if exists "Allow public read prequalify transcripts"
  on public.prequalify_transcripts;
create policy "Allow public read prequalify transcripts"
  on public.prequalify_transcripts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public insert prequalify transcripts"
  on public.prequalify_transcripts;
create policy "Allow public insert prequalify transcripts"
  on public.prequalify_transcripts
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public update prequalify transcripts"
  on public.prequalify_transcripts;
create policy "Allow public update prequalify transcripts"
  on public.prequalify_transcripts
  for update
  to anon, authenticated
  using (true)
  with check (true);
