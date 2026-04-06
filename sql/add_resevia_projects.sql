insert into public.projects (
  slug,
  title,
  category,
  industry,
  image,
  before_image,
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
    'resevia',
    'Resevia Website',
    'SaaS Website - Next.js',
    'AI Reception & Bookings',
    '/portfolio/resevia-website.png',
    null,
    'A conversion-focused marketing website for Resevia, designed to explain the AI receptionist quickly and move service businesses into the waitlist funnel.',
    'Clear positioning, trust-first messaging, and a faster path from first visit to waitlist signup.',
    array['Waitlist Funnel', 'Offer Clarity', 'Trust-Led Messaging'],
    'https://resevia.co.uk',
    'Challenge: explain a new AI receptionist product to non-technical owners in seconds while reducing hesitation around automation. Solution: simplified problem/solution storytelling, industry-specific sections, and a clean waitlist journey. Result: the product feels easier to understand and easier to buy into from the first scroll.',
    6,
    true,
    true
  ),
  (
    'resevia-agent',
    'Resevia Agent',
    'AI Product - Operations Demo',
    'Salon Operations',
    '/portfolio/resevia-agent.png',
    null,
    'An internal AI receptionist application handling salon conversations, service Q&A, booking workflows, and human handoff when confidence or policy boundaries require review.',
    'A two-sided product experience that compares manual approval vs autonomous replies before go-live.',
    array['Manual Approval Mode', 'Autonomous Reply Mode', 'Booking + Handoff Flows'],
    'https://app.resevia.co.uk/test-ui',
    'Challenge: make AI automation feel safe enough for real booking operations while preserving speed. Solution: a review-first workflow, clear escalation triggers, and session tooling for availability, booking, and handoff logic. Result: teams can QA behaviour in manual mode, then confidently switch to autonomous handling when ready.',
    7,
    false,
    true
  )
on conflict (slug) do update
set
  title = excluded.title,
  category = excluded.category,
  industry = excluded.industry,
  image = excluded.image,
  before_image = excluded.before_image,
  description = excluded.description,
  summary = excluded.summary,
  highlights = excluded.highlights,
  live_url = excluded.live_url,
  case_study = excluded.case_study,
  sort_order = excluded.sort_order,
  featured = excluded.featured,
  published = excluded.published;
