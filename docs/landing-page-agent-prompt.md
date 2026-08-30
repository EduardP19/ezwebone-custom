# Agent prompt — £200 website landing page

> Paste everything below into Claude Code, Cursor, v0, Lovable or similar.
> Replace `#REPLACE-ME` with your brand hex before you send it.

---

## Brief

Build a single-file landing page: `index.html`, with all CSS and JS inline. No build step, no frameworks, no npm. It must open by double-clicking the file and be droppable onto Netlify or Cloudflare Pages as-is.

**Audience:** UK small business owners — trades, salons, cafés, cleaners, gardeners, tutors. Not technical. Sceptical of agencies. Reading on a phone, probably one-handed, probably in the evening.

**The page has one job:** get them to book a 20-minute call. Nothing is sold on the page. There is no "Buy now", no pricing table with tiers, no checkout. Every call to action goes to the same booking section.

---

## The offer (use these facts exactly — do not soften or embellish them)

- **£200. One payment. Inc. VAT.**
- **5 pages**, written and built for their business.
- **Full SEO setup** — page titles, descriptions, structured data, sitemap, submitted to Google.
- **Google Business Profile** created or claimed and set up properly, so they show up on Google Maps and in local search.
- **Hosting included — forever.** Not a year. Forever. No monthly fee, no renewal, no invoice ever again.
- **The only thing they ever pay again is their domain name**, roughly £12 a year, paid directly to the registrar in their own account — never to me.
- **They own it.** Their domain, their account, no lock-in.
- **They pay after they see it**, not before.
- **Live in 7 days** from the call.

The "hosting included forever, nothing to pay again" point is the strongest thing on the page. Give it real weight in the hero and repeat it once in the FAQ. Say it plainly — no asterisks, no "terms apply" energy.

---

## Design direction

**Typography carries the page.** Use a heavy, tightly-tracked geometric or grotesque display face for headlines at large sizes with negative letter-spacing, paired with a clean, highly readable body face, plus a monospace face used sparingly for small uppercase labels and eyebrows. Headlines should feel confident and physical, like painted shop signage — not soft, not corporate. Set a clear type scale using `clamp()` so it holds up from 360px to desktop.

**Colour — use my brand colour:**

- Brand: `#REPLACE-ME` — this is the single loud colour on the page.
- Use it the way a shop sign uses paint: solid blocks, hard edges, no gradients, no glows, no soft shadows. Highlight one phrase in the headline with it as a solid block behind the text. Use it for the price. Use it as an offset hard-edged shadow behind the main price panel and buttons.
- Everything else stays quiet: one very dark neutral for text and dark sections, one light cool neutral for alternating section backgrounds, white, and one hairline border colour.
- If the brand colour is dark, put white or near-white text on it. If it's light or bright, put the dark neutral on it. Check contrast is at least 4.5:1 for body text and 3:1 for large text, and adjust the neutrals to suit — do not adjust my brand hex.
- Define all colours as CSS custom properties at the top so I can change one value and reskin the page.

**Buttons:** solid brand fill, dark 2px border, hard offset shadow that shifts on hover and press so the button feels like it physically depresses. No rounded pill shapes.

**Structure:** hard 2px rules between major sections, hairline dividers inside them. Grid cells separated by 1px gaps showing the border colour through. Near-zero border radius throughout.

**Signature element:** a bold price panel just below the hero headline — the £200 rendered very large in the brand colour on a dark block, sitting next to a short ticked list of what's included, with a hard offset shadow in the brand colour. This is the one loud thing. Keep everything else disciplined.

**Motion:** minimal. A subtle fade-and-rise as sections scroll into view, and the button press micro-interaction. Nothing else. Respect `prefers-reduced-motion`.

---

## Page sections, in order

1. **Sticky header** — wordmark left, "Book a call" button right. Stays visible on scroll.
2. **Hero** — headline naming the offer in plain words, a subheading covering 5 pages / £200 / nothing to pay again, primary CTA, and a one-line reassurance under it ("Free. No obligation. I'll say if it's not a fit.").
3. **Price panel** — the signature element described above.
4. **What's included** — a grid of 6 cells covering: the 5 pages written for them, mobile, SEO, Google Business Profile, contact that works (tap-to-call, WhatsApp, form), hosting and setup done for them.
5. **What the 5 pages are** — name them concretely: Home, Services, About, Gallery or Work, Contact. Explain in one line each why a small business needs that page.
6. **How it works** — 3 numbered steps: the 20-minute call (day 0, free), I build it and send a link with unlimited changes until it feels right (days 1–5), you pay and it goes live (days 6–7). Numbers are justified here because it's a real sequence — do not use numbered markers anywhere else.
7. **Who it's for / who it isn't** — two columns, ticks and crosses. Be genuinely honest about who should not buy: online shops, booking systems, customer logins, ongoing ads management. End with a line saying to book the call anyway and I'll point them elsewhere if it's not me.
8. **Recent work** — three placeholder boxes with a clear HTML comment telling me to swap in real screenshots.
9. **FAQ** — native `<details>` accordions, no JS. Cover: why is it only £200 and what's the catch; are there really no monthly fees ever; what about the domain; what do I need to give you; do I own it; what if I want changes later; what if I don't like it.
10. **Booking section** — dark background, Calendly inline embed with a clearly commented placeholder URL, plus WhatsApp and email fallback links with commented placeholders.
11. **Footer** — one line, business name and location, auto-updating year.

---

## Copy rules

Write all the copy yourself — do not use lorem ipsum, and do not leave copy placeholders except the ones listed below.

- Plain English, sentence case, short sentences. Write how you'd talk to a plumber, not a marketing director.
- No jargon: no "solutions", "bespoke", "digital presence", "elevate", "unlock", "transform your business".
- No fake urgency, no fake scarcity, no invented testimonials, no invented statistics.
- Say the price early and say it clearly. The confidence is the pitch.
- Active voice on every button. Every CTA says the same thing: "Book a 20-minute call".

---

## Placeholders — mark each with an obvious HTML comment

- Calendly URL
- WhatsApp number
- Email address
- Three work screenshots
- Domain cost figure in the FAQ

Add a short comment block at the very top of the file listing exactly which lines I need to edit before publishing.

---

## Quality floor

- Responsive from 360px up, tested at 360 / 768 / 1280.
- Visible keyboard focus on every link, button and accordion.
- Semantic HTML, one `<h1>`, real landmarks.
- `<title>`, meta description and Open Graph tags filled in with real copy.
- Watch CSS specificity — don't let section padding rules cancel each other out.
- No external dependencies except the web fonts and the Calendry embed script.

When you're done, tell me the three things you'd change to improve conversion, and don't make those changes yourself.
