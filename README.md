# EZWebOne — Freelance Web Studio (Side Project)

> A fully-functional freelance web agency site I built and ran on the side. It never had the goal of replacing a day job — it was a sandbox for real product engineering: API integrations, AI-powered lead qualification, and direct-mail marketing automation. Everything here is production code that ran (or runs) live.
>
> **Live site: [www.ezwebone.co.uk](https://www.ezwebone.co.uk)**

---

## What This Is

**EZWebOne** was my freelance brand for offering custom website builds to small UK businesses. The premise was simple: a polished, trustworthy-looking studio site that could convert cold traffic into paying clients.

The brand was never meant to scale. It was designed to:

- Keep side-project infrastructure funded
- Give me a real product to iterate on
- Demonstrate full-stack thinking to potential employers

---

## Tech Stack

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Framework    | Next.js 16 (App Router)              |
| Language     | TypeScript                           |
| Styling      | Tailwind CSS v4                      |
| Animation    | Framer Motion                        |
| Database     | Supabase (Postgres)                  |
| Email        | Resend + React Email                 |
| AI           | Claude API (Anthropic) via streaming |
| Direct Mail  | Stannp API                           |
| Company Data | Companies House API (UK Gov)         |
| Deployment   | Vercel                               |

---

## Architecture Highlights

### AI Lead Qualification Agent

The site has a chat widget that runs a Claude-powered prequalification agent. When a visitor starts a conversation, it:

1. Asks structured questions to qualify intent and budget
2. Persists the conversation to Supabase with a session ID
3. Sends a lead summary email to me (via Resend) when the flow completes
4. Enforces a trial message limit before requiring an email address

The agent logic lives in [lib/agent-chat.ts](lib/agent-chat.ts) and [app/api/agent-chat/route.ts](app/api/agent-chat/route.ts). Prompts are maintained as local agent briefs under [agents/](agents/).

### Local Claude Agents for Development

The repo ships with project-specific Claude agent briefs used inside **Claude Code** (the CLI) while building. These live in [agents/claude/agents/](agents/claude/agents/) and cover things like:

- How the site content model works
- Prompt and copy conventions
- Agent architecture decisions

This means Claude Code has persistent context about the project across sessions — effectively a local AI development team of one. The approach keeps prompts version-controlled alongside the code they describe, so context doesn't drift as the product evolves.

### Guides — QR Code Content Delivery

Physical letters sent to businesses include a unique alphanumeric code. Recipients visit the site, enter their code, and unlock a personalised web strategy guide. The codes and recipient records are seeded from the Companies House pipeline — the same API that sources company names and director addresses for the Stannp campaign also generates the guide assignments, so each letter maps to a specific business in the database. The flow:

- Code is validated and looked up in Supabase ([lib/guides.ts](lib/guides.ts))
- A personalised guide is emailed via Resend (HTML templates live under [emails/](emails/))
- The claim event is stored as a row in `public.leads` (with tracking params inside `metadata` for attribution)

Route: [app/api/guides/claim/route.ts](app/api/guides/claim/route.ts)

---

## Marketing: Stannp Direct Mail Campaign

One of the more unusual integrations. Rather than running ads, I targeted newly incorporated UK companies by pulling data from the **Companies House API** and sending physical letters via **Stannp** (a UK letter-printing and postal service).

### How it worked

1. **Companies House import** ([lib/companiesHouseImport.ts](lib/companiesHouseImport.ts)) — polls the Companies House API for recently registered businesses, filters by industry, and stores director records in Supabase.

2. **PSC enrichment** ([lib/companiesHousePSC.ts](lib/companiesHousePSC.ts)) — fetches Persons of Significant Control data to get the director's full name and correspondence address.

3. **Letter scheduling** — a Vercel Cron job hits [app/api/stannp/send-due/route.ts](app/api/stannp/send-due/route.ts) on a schedule, which picks directors whose letters are due and dispatches them via the Stannp API. The cron endpoint is protected by a bearer token.

4. **Preview endpoint** — [app/api/stannp/preview/route.ts](app/api/stannp/preview/route.ts) generates a PDF preview of any letter before it goes out, using `test: true` on the Stannp payload. Useful for checking address formatting before spending on postage.

5. **QR code + unique code tracking** — each letter includes a personalised URL and code that ties back to the director's record in Supabase, so I can see which letters converted to guide claims.

The integration required building a typed wrapper around the Stannp REST API ([lib/stannpAPI.ts](lib/stannpAPI.ts)), handling Companies House's inconsistent address schema, and managing campaign state (pending, sent, bounced) in Supabase.

---

## Other Integrations

- **Resend** — transactional email for the contact form, guide delivery, and lead summaries. Components built with React Email in [emails/](emails/).
- **Supabase** — persists leads, chat sessions, guide claims, director records, and letter campaign state. Admin client is server-side only.
- **Framer Motion** — page transitions and scroll-triggered animations.
- **Sitemap + robots** — auto-generated from route config ([app/sitemap.ts](app/sitemap.ts), [app/robots.ts](app/robots.ts)).

---

## Pages

| Route                            | Purpose                                       |
| -------------------------------- | --------------------------------------------- |
| `/`                              | Homepage                                      |
| `/about`                         | About the studio                              |
| `/services`                      | Service offerings                             |
| `/portfolio`                     | Past work showcase                            |
| `/blog`                          | Content marketing                             |
| `/guides`                        | QR code guide claim flow                      |
| `/contact`                       | Contact form (Resend)                         |
| `/new-business`                  | Landing page for direct mail campaign traffic |
| `/dev`                           | Internal tooling (protected)                  |
| `/privacy`, `/terms`, `/cookies` | Legal pages                                   |

---

## Running Locally

```bash
npm install
npm run dev
```

Environment variables needed: Supabase URL + anon/service keys, Resend API key, Anthropic API key, Stannp API key, Companies House API key, cron secret. Copy `.env.local` from your own config — no `.env.example` is committed as most keys are live credentials.

---

## What I'd Tell a Recruiter

This project exists because I wanted to build something with real stakes — not a tutorial clone. Every integration here solved an actual problem:

- The AI agent had to qualify leads without me being available 24/7
- The direct mail pipeline had to handle dirty address data and postal edge cases at scale
- The guide delivery had to be reliable enough that a physical letter promising a download actually delivered one

The brand never took off commercially, and it wasn't supposed to. It was always a vehicle for the engineering.
