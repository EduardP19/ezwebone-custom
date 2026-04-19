alter table public.ch_directors_non_ro
  add column if not exists registered_address jsonb not null default '{}'::jsonb;

alter table public.ch_directors_ro
  add column if not exists registered_address jsonb not null default '{}'::jsonb;
