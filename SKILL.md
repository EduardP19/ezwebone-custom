---
name: ezwebone-agency-build
description: >
  Use this skill when building any new website, landing page, or product for
  EZWebOne or its sub-brands (e.g. Resevia, Omus Labs). Triggers include: any
  request to scaffold a new Next.js project, replicate an existing product's
  backend functions, create a new Supabase database, or build marketing pages
  for the agency's services. Also use when the user says "new project", "new
  DB", "replicate the backend", or references files like SPEC.md, COPY.md, or
  PROMPT.md from the Resevia workspace. Do NOT use for one-off Wix/Velo
  scripts, email drafts, or ad copy tasks.
license: Internal — EZWebOne / Eduard Nitu
---

# EZWebOne Agency Build Skill

You are building a production website or product for **EZWebOne** — a solo UK
digital agency run by Eduard that specialises in web design, automation, and AI
products for small businesses. Eduard is not a traditional software engineer; he
vibe-codes and uses AI tooling heavily. All code must be clean, well-commented,
and pasteable straight into VS Code or AGV without modification.

---

## 0 — Read Source Files First

The workspace **always** contains three source-of-truth files. Read all three in
full before writing a single line of code:

| File | Purpose |
|------|---------|
| `SPEC.md` | Stack, brand colours, fonts, folder structure, Supabase schema, env vars |
| `COPY.md` | Every word of UI copy — never invent or paraphrase |
| `PROMPT.md` | Ordered build instructions — follow the step sequence exactly |

> **Rule:** If any of these files conflict with each other, `SPEC.md` wins for
> technical decisions and `COPY.md` wins for all copy.

---

## 1 — Brand & Design Constraints

Pull exact values from `SPEC.md`. Defaults for EZWebOne/Resevia products:

```
Background:     #FFFFFF
Primary Purple: #6D28D9  — buttons, links, highlights
Electric Blue:  #2563EB  — secondary CTAs, hover states
Sand Gold:      #C9A96E  — badges, borders, premium accents
Section BG:     #F9F8FF  — alternating sections
Heading Text:   #1C1917
Body Text:      #6B7280

Headings font:  Montserrat (Google Fonts)
Body font:      Inter (Google Fonts)
```

- Load both fonts via `next/font/google` in `layout.tsx`.
- Never hardcode hex values in component files — use Tailwind brand classes
  defined in `tailwind.config.ts`.
- Never use purple gradients on white as a background effect — it is
  explicitly off-brand for Resevia.

---

## 2 — Stack

```
Framework:   Next.js 14 (App Router, TypeScript)
Styling:     Tailwind CSS
Animations:  Framer Motion
Database:    Supabase (Postgres + RLS)
Email:       Resend.com  (from: hello@resevia.co.uk or hello@ezwebone.co.uk)
Deployment:  Vercel
IDE:         AGV (Google Antigravity IDE) or VS Code
```

All dev accounts use `supp.ezweb@gmail.com`.

---

## 3 — Supabase — Always Create a New DB

**Every new project gets its own Supabase database.** Never reuse or share a
database between products.

### 3a — Replicate Backend Functions

The Resevia workspace (`SPEC.md`) defines the canonical backend pattern. For
every new project, replicate the following and adapt field names to the new
product:

**`lib/supabase.ts`**
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**`lib/resend.ts`**
```ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

**`app/api/[form-name]/route.ts`** — adapt the table name and fields:
```ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  const body = await req.json()

  // 1. Validate required fields
  if (!body.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // 2. Insert into Supabase
  const { error } = await supabase.from('YOUR_TABLE').insert([body])
  if (error?.code === '23505') {
    return NextResponse.json({ error: 'Already registered' }, { status: 409 })
  }
  if (error) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // 3. Send confirmation email via Resend
  await resend.emails.send({
    from: 'hello@YOUR_DOMAIN.co.uk',
    to: body.email,
    subject: 'YOUR SUBJECT LINE',
    html: `<p>YOUR CONFIRMATION BODY</p>`,
  })

  return NextResponse.json({ success: true })
}
```

### 3b — New DB Schema (template — adapt fields per project)

```sql
-- Replace YOUR_TABLE and add/remove columns to match the product
CREATE TABLE your_table (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name            TEXT,
  email                 TEXT UNIQUE NOT NULL,
  business_type         TEXT,        -- adapt or remove
  extra_field_1         TEXT,        -- add project-specific fields here
  extra_field_2         TEXT,
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON your_table
  FOR INSERT TO anon
  WITH CHECK (true);
```

> **Rule:** After writing the schema, also add it to `SPEC.md` in the project
> workspace so it stays as the single source of truth.

### 3c — `.env.local` template

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

Never commit `.env.local`. Add it to `.gitignore` on project init.

---

## 4 — Folder Structure (canonical)

Follow exactly as defined in `SPEC.md`. If `SPEC.md` is absent, use:

```
app/
  layout.tsx
  page.tsx
  [page-name]/page.tsx
  api/[endpoint]/route.ts

components/
  layout/Navbar.tsx
  layout/Footer.tsx
  sections/[SectionName].tsx
  ui/Button.tsx
  ui/Card.tsx
  ui/Badge.tsx
  ui/[FormName].tsx

lib/
  supabase.ts
  resend.ts

styles/globals.css
public/logo.svg
public/og-image.png
.env.local
tailwind.config.ts
```

---

## 5 — UI Components (standard set)

Build these once per project. They must accept `variant` and `size` props and
use only Tailwind brand classes.

- **`Button.tsx`** — variants: `primary` (purple fill), `secondary` (gold
  outline), `ghost`; sizes: `sm`, `md`, `lg`
- **`Badge.tsx`** — small pill, gold background, purple text
- **`Card.tsx`** — white bg, subtle border, `rounded-xl`, padding prop
- **`[FormName].tsx`** — POST to the API route, show success/error inline, no
  page reload, disable submit button while loading

---

## 6 — Sections Build Order

Follow `PROMPT.md` step sequence. If building a home page from scratch, the
standard order is:

1. Hero — fade-up on load, H1 + subheadline + CTA + supporting text
2. ProblemBlock — off-white bg, pain point cards with icons
3. SolutionBlock — white bg, benefit cards with checkmarks
4. HowItWorks — numbered steps, purple circle indicators
5. Industries / Features — 3×2 grid, gold border on hover
6. SocialProof — purple bg, white text, stat + trust line
7. PricingTeaser — 3 cards, middle card highlighted with purple border
8. FinalCTA — inline form, no separate page load

Use **Framer Motion** `fadeInUp` variant with `viewport={{ once: true }}` on
every section wrapper.

---

## 7 — Metadata & SEO

Set in `layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: 'PAGE TITLE — EZWebOne / Resevia',
  description: 'PAGE DESCRIPTION',
  openGraph: {
    images: ['/og-image.png'],
  },
}
```

---

## 8 — Pages

For each page in `PROMPT.md`, import and compose only the relevant section
components. Never duplicate copy inline — always import from `COPY.md`-sourced
constants or render from component props.

---

## 9 — Final Checks (run before handing back)

- [ ] All copy matches `COPY.md` exactly — no invented text
- [ ] All colours use Tailwind brand classes — no hardcoded hex
- [ ] `.env.local` is in `.gitignore`
- [ ] `next build` passes with zero errors
- [ ] All pages are mobile responsive
- [ ] Form handles success, error, duplicate, and loading states
- [ ] Supabase RLS policy applied to the new table
- [ ] Resend confirmation email sends correctly in test mode

---

## 10 — EZWebOne Brand Context (for copy tone)

EZWebOne positions itself as:
- Fast (5-day delivery)
- Transparent (no hidden fees, client owns everything)
- Practical (done-for-you, no jargon)
- Growing into AI automation (Resevia, reception agents)

Target clients: UK small business owners, especially service businesses
(salons, clinics, events, hospitality). Tone: confident, warm, no fluff.
Sub-brand Resevia targets beauty/hair salons specifically.
