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
values (
  'the-bus-stop',
  'The Bus Stop',
  'Hospitality · Custom Website',
  'Glamping & Tourism',
  'https://static.wixstatic.com/media/8f98dc_624cb82fcd7f4673a2e04a6b1a6b08fc~mv2.jpg',
  null,
  'A custom-built website for an award-recognised East Lothian glamping business, combining bespoke design, a tailored gift voucher flow, and search-led content structure to support visibility and bookings.',
  'Custom-coded build with gift vouchers, bespoke design, and deep SEO-led structure for a distinctive glamping brand.',
  array['Custom Code', 'Gift Voucher Flow', 'SEO Research'],
  'https://www.thebusstop.scot/',
  'We pushed the project far beyond a standard template, custom-designing every section, building custom code around the gift voucher journey, and shaping the site architecture and content around real search demand so the business could be found more easily and convert more confidently.',
  6,
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
