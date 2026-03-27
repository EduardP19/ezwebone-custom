# EZWebOne — Agent Build Instructions

Read SPEC.md and COPY.md fully before writing any code.
SPEC.md is your technical source of truth.
COPY.md is your content source of truth.
Never invent copy or colours — use exactly what is defined.

---

## Build Order

### Step 1 — Project Setup
- Init Next.js 14 with App Router and TypeScript
- Install: tailwindcss, framer-motion, @supabase/supabase-js, resend
- Configure tailwind.config.ts with brand colours and fonts from SPEC.md
- Add Syne and Inter from Google Fonts via next/font/google in layout.tsx
- Set up globals.css with base Tailwind directives

### Step 2 — Supabase
- Create lib/supabase.ts with createClient using env variables
- Create a NEW Supabase database — do not reuse the Resevia DB
- Run the full schema from SPEC.md: leads table + posts table
- Apply RLS and insert policy to both tables

### Step 3 — Resend
- Create lib/resend.ts
- Confirmation email from: hello@ezwebone.co.uk
- Subject: Thanks for getting in touch — EZWebOne
- Body: confirm receipt of enquiry, say we'll respond within 24 hours,
  include Calendly booking link placeholder

### Step 4 — API Route
- Create app/api/contact/route.ts
- POST handler:
  - Validate first_name and email (400 if missing)
  - Insert full form payload into leads table in Supabase
  - Send confirmation email via Resend to submitter
  - Send internal notification email to hello@ezwebone.co.uk with lead details
  - Return 200 on success
  - Handle DB errors with 500 response

### Step 5 — UI Components
Build in this order:
1. ui/Button.tsx
   - variant: primary (black fill, white text), secondary (blue outline),
     ghost (no border, underline on hover)
   - sizes: sm / md / lg
2. ui/Badge.tsx
   - Small pill, gold bg (#C9A96E), dark text, rounded-full
3. ui/Card.tsx
   - White bg, border (#E5E4E1), rounded-xl, padding prop (sm/md/lg)
4. ui/ContactForm.tsx
   - All fields from COPY.md Contact section
   - POST to /api/contact
   - Inline success message on submit — no page reload
   - Disable button and show loading state while submitting
   - Show field-level validation errors

### Step 6 — Layout
1. Navbar.tsx
   - Logo left (SVG from public/logo.svg)
   - Nav links centre: Services · Portfolio · About · Blog
   - CTA button right: Book a Free Call (primary button, links to /contact)
   - Sticky, white bg, subtle bottom border on scroll
   - Mobile: hamburger menu, full-screen drawer

2. Footer.tsx
   - 3-column link grid + tagline
   - Resevia external link opens in new tab
   - Legal links and copyright line

### Step 7 — Home Page Sections
Build each as its own file in components/sections/.
Use COPY.md for every word. Use Framer Motion fadeInUp on each section.
Build in this order:

1. Hero.tsx
   - Full-width, white bg
   - H1 headline (Syne font, large), subheadline, two CTA buttons
   - Social proof row: avatar stack + "110+ happy clients" + star rating
   - Fade-up animation on load with staggered children

2. TrustBar.tsx
   - Warm white bg (#F8F7F4)
   - "Trusted by" label + scrolling or static client name list
   - Subtle, low-height section

3. Services.tsx
   - White bg
   - Label + headline
   - 4 service cards in 2×2 grid (mobile: 1 col)
   - Each card: icon, title, short description
   - AI Agents card has gold "Powered by Resevia" badge

4. HowItWorks.tsx
   - Warm white bg
   - Label + headline
   - 4 steps: number in black circle, title, description
   - Horizontal on desktop, vertical on mobile
   - Connecting line between steps on desktop

5. Portfolio.tsx
   - White bg
   - Label + headline + subtext
   - 3-column grid of project cards (mobile: 1 col)
   - Each card: project image placeholder, name, industry tag
   - "See All Projects" CTA button linking to /portfolio

6. AITeaser.tsx
   - Dark bg (#0A0A0A), white text
   - "New" badge in gold
   - Headline + body + CTA button linking to resevia.co.uk
   - Opens in new tab

7. Testimonials.tsx
   - Warm white bg
   - Label + headline
   - 3 testimonial cards: quote, name, star rating
   - Cards in 3-col grid (mobile: 1 col)

8. FinalCTA.tsx
   - Blue bg (#2563EB), white text
   - Headline + body + CTA button (white fill, black text)
   - Supporting text below button

### Step 8 — Pages

1. app/page.tsx
   Import and render all sections in order:
   Hero → TrustBar → Services → HowItWorks → Portfolio →
   AITeaser → Testimonials → FinalCTA

2. app/services/page.tsx
   - Use COPY.md Services page section
   - 4 service blocks with pricing, delivery time, and includes list
   - CTA at bottom

3. app/portfolio/page.tsx
   - Use COPY.md Portfolio page section
   - Full project grid with industry filter tabs
   - CTA at bottom

4. app/about/page.tsx
   - Use COPY.md About page section
   - Stats row (4 stats in a horizontal band)
   - CTA at bottom

5. app/blog/page.tsx
   - Fetch published posts from Supabase posts table (published = true)
   - Render as card grid: cover image, title, excerpt, date
   - Link each card to /blog/[slug]

6. app/blog/[slug]/page.tsx
   - Fetch single post by slug from Supabase
   - Render title, cover image, content (markdown or plain text)
   - Return 404 if not found

7. app/contact/page.tsx
   - Use COPY.md Contact page section
   - Render ContactForm component
   - Add Calendly embed or link as fallback

### Step 9 — Metadata
Set in layout.tsx:
- title: EZWebOne — Web Design & Digital Growth Agency
- description: We design and build fast, conversion-focused websites for UK
  small businesses. Delivered in 5 days. Fully yours from day one.
- og:image: /og-image.png
- favicon: /logo.svg

### Step 10 — Final Checks
- All pages mobile responsive (test at 375px, 768px, 1280px)
- ContactForm works end to end: DB insert + confirmation email + internal alert
- Blog fetches and renders correctly from Supabase
- No hardcoded colours — Tailwind brand classes only
- No placeholder or invented copy — everything from COPY.md
- .env.local is in .gitignore
- Run next build with zero TypeScript errors before handing back
