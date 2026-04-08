create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  audience text not null check (audience in ('ezwebone', 'beauty')),
  question_en text not null,
  answer_en text not null,
  question_ro text not null,
  answer_ro text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create index if not exists idx_faqs_audience_active_sort
  on public.faqs (audience, is_active, sort_order asc, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_faqs_set_updated_at on public.faqs;
create trigger trg_faqs_set_updated_at
before update on public.faqs
for each row
execute function public.set_updated_at();

insert into public.faqs (audience, question_en, answer_en, question_ro, answer_ro, sort_order)
values
  (
    'ezwebone',
    'How quickly can you build a new website?',
    'Most service-business websites go live in 7-21 days depending on copy, assets, and feedback speed.',
    'Cat de repede puteti construi un website nou?',
    'Pentru majoritatea business-urilor de servicii, website-ul poate fi live in 7-21 zile, in functie de continut, materiale si viteza feedback-ului.',
    10
  ),
  (
    'ezwebone',
    'Do you only build websites or also automation and AI?',
    'We build complete growth systems: website, lead capture, CRM automations, and practical AI workflows.',
    'Faceti doar website-uri sau si automatizari si AI?',
    'Construim sisteme complete de crestere: website, captare lead-uri, automatizari CRM si fluxuri AI practice.',
    20
  ),
  (
    'ezwebone',
    'Can you work with our current tools?',
    'Yes. We usually integrate with your existing stack first, then recommend changes only when there is a clear upside.',
    'Puteti lucra cu tool-urile noastre actuale?',
    'Da. De regula, integrăm mai intai tool-urile existente si recomandam schimbari doar daca exista un beneficiu clar.',
    30
  ),
  (
    'ezwebone',
    'Is this a one-off build or ongoing support?',
    'Both options are available. You can choose a one-off project or ongoing support for SEO, automations, and iteration.',
    'Este un proiect one-off sau oferiti suport continuu?',
    'Ambele variante sunt disponibile. Poti alege un proiect punctual sau suport continuu pentru SEO, automatizari si optimizari.',
    40
  ),
  (
    'beauty',
    'I run a salon. What is the fastest way to get more bookings?',
    'The fastest win is usually a clear service page, booking-first call-to-actions, and an automated missed-call follow-up flow.',
    'Conduc un salon. Care este cea mai rapida metoda sa obtin mai multe programari?',
    'Cel mai rapid rezultat vine de obicei dintr-o pagina clara de servicii, call-to-action orientat pe programari si follow-up automat la apeluri pierdute.',
    10
  ),
  (
    'beauty',
    'Can you help us reduce no-shows?',
    'Yes. We can set up reminder sequences, confirmations, and smart rebooking prompts.',
    'Ne puteti ajuta sa reducem neprezentarile la programari?',
    'Da. Putem configura secvente de remindere, confirmari si prompt-uri inteligente pentru reprogramare.',
    20
  ),
  (
    'beauty',
    'Do you support local SEO for beauty businesses?',
    'Yes. We optimize your site and local presence so clients in your area find you first for your priority services.',
    'Oferiti SEO local pentru business-uri de beauty?',
    'Da. Optimizam website-ul si prezenta locala astfel incat clientii din zona ta sa te gaseasca primii pentru serviciile importante.',
    30
  ),
  (
    'beauty',
    'Can this work if we are already busy and have little admin time?',
    'Absolutely. Our goal is to reduce admin load by automating repetitive communication and lead handling.',
    'Poate functiona si daca suntem deja foarte ocupati si avem putin timp administrativ?',
    'Absolut. Scopul nostru este sa reducem munca administrativa prin automatizarea comunicarii repetitive si gestionarii lead-urilor.',
    40
  )
on conflict do nothing;
