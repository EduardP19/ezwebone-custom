-- Projects table for homepage and portfolio content.
-- Run in Supabase SQL Editor or via a DB client.

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  slug text not null unique,
  title text not null,
  category text not null,
  industry text not null,
  image text not null,
  description text not null,
  summary text not null,
  highlights text[] not null default '{}'::text[],
  live_url text null,
  case_study text null,
  sort_order integer not null default 100,
  featured boolean not null default false,
  published boolean not null default true
);

create index if not exists idx_projects_published_sort on public.projects (published, sort_order, created_at desc);
create index if not exists idx_projects_slug on public.projects (slug);

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_projects_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Allow anonymous read access to published projects" on public.projects;
create policy "Allow anonymous read access to published projects"
on public.projects
for select
to anon
using (published = true);

drop policy if exists "Allow authenticated read access to projects" on public.projects;
create policy "Allow authenticated read access to projects"
on public.projects
for select
to authenticated
using (true);

insert into public.projects (
  slug,
  title,
  category,
  industry,
  image,
  description,
  summary,
  highlights,
  live_url,
  case_study,
  sort_order,
  featured,
  published
)
values
  (
    'say-i-do-weddings',
    'Say I Do Weddings',
    'Wedding · Web Design',
    'Luxury Events',
    '/portfolio/project1.png',
    'A romantic, conversion-focused site for a UK wedding planner. Designed to feel premium quickly and support higher-value enquiries.',
    'Designed to feel more refined, reassure quickly, and support higher-value enquiries.',
    array['Mobile First', 'SEO Ready', 'Booking Integrated'],
    null,
    'We rebuilt the presentation around trust, polish, and enquiry clarity so the brand felt more premium from the first scroll.',
    1,
    true,
    true
  ),
  (
    'the-memory-corners',
    'The Memory Corners',
    'Events · Booking Site',
    'Experiential Brand',
    '/portfolio/project2.png',
    'A polished site for a photo booth company with online booking flows, event galleries, and a layout built to convert busy visitors fast.',
    'Upgraded visual confidence and offer presentation for a more polished buyer journey.',
    array['Online Booking', 'Gallery Ready', 'Event Focused'],
    null,
    'The project focused on making the offer easier to understand at speed while keeping the experience warm, visual, and event-led.',
    2,
    false,
    true
  ),
  (
    'txengo',
    'Txengo',
    'Creative · Portfolio',
    'Creative Consultant',
    '/portfolio/project3.png',
    'A bold creative portfolio with punchy visuals, structured storytelling, and smooth motion that keeps the work front and centre.',
    'Editorial storytelling and premium pacing to make the portfolio feel more ownable and valuable.',
    array['Bold Visuals', 'Motion Led', 'Grid Layout'],
    null,
    'We leaned into editorial rhythm and stronger story framing so the work felt sharper, more intentional, and easier to value.',
    3,
    false,
    true
  ),
  (
    'proveit',
    'ProveIt',
    'Community · Platform',
    'Community Platform',
    '/portfolio/project4.png',
    'A trust-focused platform for the Romanian community in the UK with stronger content structure, blog integration, and a clearer membership journey.',
    'Clearer structure and stronger information design for a more trustworthy digital product experience.',
    array['Trust Focused', 'Blog Integrated', 'Community First'],
    null,
    'The redesign clarified the information architecture so visitors could understand the platform faster and trust it sooner.',
    4,
    false,
    true
  ),
  (
    'study-and-succeed',
    'Study and Succeed',
    'Education · Agency',
    'Education Brand',
    '/portfolio/project5.png',
    'A bilingual language travel site with clearer programme filtering, student-first navigation, and a cleaner path from discovery to enquiry.',
    'Improved hierarchy and conversion flow so visitors understand the offer faster and act sooner.',
    array['Bilingual', 'Programme Filters', 'Student First'],
    null,
    'The main work here was simplifying choice, improving page hierarchy, and making the next step feel obvious for prospective students.',
    5,
    false,
    true
  )
on conflict (slug) do update
set
  title = excluded.title,
  category = excluded.category,
  industry = excluded.industry,
  image = excluded.image,
  description = excluded.description,
  summary = excluded.summary,
  highlights = excluded.highlights,
  live_url = excluded.live_url,
  case_study = excluded.case_study,
  sort_order = excluded.sort_order,
  featured = excluded.featured,
  published = excluded.published;
