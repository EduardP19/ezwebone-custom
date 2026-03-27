# EZWebOne — Project Specification

## Stack
- Framework: Next.js 14 (App Router, TypeScript)
- Styling: Tailwind CSS
- Animations: Framer Motion
- Database: Supabase (new DB — do not reuse Resevia DB)
- Email: Resend.com
- Deployment: Vercel
- Domain: ezwebone.co.uk

## Brand Colours
- Background: #FFFFFF
- Primary Black: #0A0A0A — headings, primary buttons
- Accent Electric: #2563EB — links, highlights, hover states
- Warm White: #F8F7F4 — alternating section backgrounds
- Muted Gray: #6B7280 — body text
- Border Gray: #E5E4E1 — cards, dividers
- Gold Accent: #C9A96E — badges, premium callouts

## Typography
- Headings: Syne (Google Fonts) — bold, modern agency feel
- Body: Inter (Google Fonts)

## Tailwind Config
extend.colors.brand:
  black: '#0A0A0A'
  blue: '#2563EB'
  warm: '#F8F7F4'
  gray: '#6B7280'
  border: '#E5E4E1'
  gold: '#C9A96E'

extend.fontFamily:
  sans: ['Inter', 'sans-serif']
  display: ['Syne', 'sans-serif']

## Folder Structure
app/
  layout.tsx
  page.tsx
  services/page.tsx
  portfolio/page.tsx
  about/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  contact/page.tsx
  api/contact/route.ts

components/
  layout/Navbar.tsx
  layout/Footer.tsx
  sections/Hero.tsx
  sections/TrustBar.tsx
  sections/Services.tsx
  sections/HowItWorks.tsx
  sections/Portfolio.tsx
  sections/AITeaser.tsx
  sections/Testimonials.tsx
  sections/FinalCTA.tsx
  ui/Button.tsx
  ui/Card.tsx
  ui/Badge.tsx
  ui/ContactForm.tsx

lib/
  supabase.ts
  resend.ts

styles/globals.css
public/logo.svg
public/og-image.png
.env.local
tailwind.config.ts

## Supabase Schema

-- Contact / lead capture table
CREATE TABLE leads (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name          TEXT NOT NULL,
  last_name           TEXT,
  email               TEXT NOT NULL,
  phone               TEXT,
  business_name       TEXT,
  service_interest    TEXT,   -- 'Website Build' | 'SEO' | 'Automation' | 'AI Agent' | 'Other'
  message             TEXT,
  source_page         TEXT,   -- which page the form was submitted from
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Blog posts table (for future CMS use)
CREATE TABLE posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  cover_image TEXT,
  published   BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
