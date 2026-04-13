alter table public.logs
  add column if not exists source_site text;

alter table public.logs
  alter column source_site set default 'ezwebone';

update public.logs
set source_site = case
  when source_site is not null then source_site
  when lower(coalesce(metadata->>'site', '')) in ('eduard-dev', 'eduard-dev.io', 'eduarddev') then 'eduard-dev'
  else 'ezwebone'
end
where source_site is null;

alter table public.logs
  add constraint logs_source_site_check
  check (source_site in ('ezwebone', 'eduard-dev')) not valid;

alter table public.logs
  validate constraint logs_source_site_check;

alter table public.logs
  alter column source_site set not null;

create index if not exists idx_logs_source_site on public.logs (source_site);
