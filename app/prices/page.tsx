import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { createMetadata } from "@/lib/seo";

type PlanId = "starter" | "growth" | "pro" | "ai";
type ScopeValue = "in" | "out";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  subtitle: string;
  included: string[];
  excludedTitle?: string;
  excluded?: string[];
};

type ScopeRow = {
  feature: string;
  scope: Record<PlanId, ScopeValue>;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "£299",
    subtitle: "One-off",
    included: [
      "Custom built website - not a template",
      "Up to 5 pages",
      "Lead capture form",
      "Booking system with Google Calendar integration",
      "Accept payments",
      "Blog - you manage it, no tech knowledge needed",
      "Basic SEO setup",
      "Google Business Profile setup",
      "1 round of revisions",
    ],
    excludedTitle: "Not included - available in Growth & Pro:",
    excluded: [
      "Ongoing SEO management",
      "Social media management",
      "Email marketing",
      "Website updates & maintenance",
      "Landing pages",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "£149/month + £199 setup fee",
    subtitle: "6 month minimum",
    included: [
      "Everything in Starter",
      "Enhanced SEO",
      "3 posts per week (Facebook)",
      "1 reel per week (FB / TikTok / Instagram)",
      "Custom social media assets",
    ],
    excludedTitle: "Not included - available in Pro:",
    excluded: [
      "Email marketing",
      "Dedicated landing pages",
      "Quarterly website updates",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "£249/month + £199 setup fee",
    subtitle: "6 month minimum",
    included: [
      "Everything in Growth",
      "Email marketing setup & management",
      "Quarterly website updates (new pages, design tweaks, copy, fixes - anything)",
    ],
    excludedTitle: "Not included - available in AI & Automations:",
    excluded: [
      "AI reception agent",
      "Website chat agent",
      "Business process automations",
      "CRM & lead management",
    ],
  },
  {
    id: "ai",
    name: "AI & Automations",
    price: "Price on request",
    subtitle: "Scoped per project - book a free discovery call",
    included: [
      "AI reception agent - answers calls, books appointments 24/7",
      "AI chat agent for your website",
      "Business automations - cut out repetitive manual tasks",
      "AI-assisted content & email workflows",
      "CRM & lead management automation",
      "Custom AI solutions - built around your business",
    ],
  },
];

const scopeRows: ScopeRow[] = [
  {
    feature: "Custom built website",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Up to 5 pages",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Lead capture form",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Booking + Google Calendar integration",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Accept payments",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Blog management",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Basic SEO setup",
    scope: { starter: "in", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Enhanced SEO",
    scope: { starter: "out", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Social media posts + reels",
    scope: { starter: "out", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Custom social media assets",
    scope: { starter: "out", growth: "in", pro: "in", ai: "out" },
  },
  {
    feature: "Email marketing",
    scope: { starter: "out", growth: "out", pro: "in", ai: "in" },
  },
  {
    feature: "Quarterly website updates",
    scope: { starter: "out", growth: "out", pro: "in", ai: "out" },
  },
  {
    feature: "AI reception agent",
    scope: { starter: "out", growth: "out", pro: "out", ai: "in" },
  },
  {
    feature: "Website chat agent",
    scope: { starter: "out", growth: "out", pro: "out", ai: "in" },
  },
  {
    feature: "Business process automations",
    scope: { starter: "out", growth: "out", pro: "out", ai: "in" },
  },
  {
    feature: "CRM & lead management automation",
    scope: { starter: "out", growth: "out", pro: "out", ai: "in" },
  },
];

const whyEzWebOne = [
  "Custom built - designed and coded for your business specifically",
  "No WordPress headaches - nothing to update, nothing to break",
  "Fast load times - clean code, no bloat, better Google rankings",
  "You own it - no platform lock-in, move or scale whenever you want",
];

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description: "Transparent pricing for websites, growth systems, and AI automations.",
  path: "/prices",
  keywords: [
    "website pricing",
    "small business website cost uk",
    "ai automation pricing",
    "agency pricing packages",
  ],
});

function ScopeCell({ value }: { value: ScopeValue }) {
  if (value === "in") {
    return (
      <span className="inline-flex items-center justify-center" aria-label="Included">
        <Check className="h-4 w-4 text-emerald-400" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center" aria-label="Not included">
      <X className="h-4 w-4 text-slate-500" />
    </span>
  );
}

export default function PricesPage() {
  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <section className="section-shell py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="mono-label text-xs text-[color:var(--color-text-accent)]">Pricing</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
              Clear Plans. No Hidden Costs.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-secondary)]">
              Custom built website, fully owned by you. No monthly fees, no platform lock-in.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.id} className="surface-card rounded-[1.6rem] border border-white/10 p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-accent)]">
                  {plan.name}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                  {plan.price}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{plan.subtitle}</p>

                <p className="mt-6 text-sm font-semibold text-[color:var(--color-text-primary)]">What&apos;s included:</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                  {plan.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {plan.excludedTitle && plan.excluded && plan.excluded.length > 0 ? (
                  <>
                    <p className="mt-6 text-sm font-semibold text-[color:var(--color-text-secondary)]">
                      {plan.excludedTitle}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                      {plan.excluded.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <X className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pb-24 md:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="surface-elevated overflow-hidden rounded-[1.8rem] border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-5 py-4 text-sm font-semibold text-[color:var(--color-text-primary)]">
                      In Scope Products
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--color-text-accent)]"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scopeRows.map((row) => (
                    <tr key={row.feature} className="border-b border-white/10 last:border-0">
                      <td className="px-5 py-4 text-sm text-[color:var(--color-text-secondary)]">{row.feature}</td>
                      <td className="px-4 py-4 text-center">
                        <ScopeCell value={row.scope.starter} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <ScopeCell value={row.scope.growth} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <ScopeCell value={row.scope.pro} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <ScopeCell value={row.scope.ai} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-28 md:pb-32">
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="surface-card rounded-[1.6rem] border border-white/10 p-7 md:p-9">
            <p className="mono-label text-xs text-[color:var(--color-text-accent)]">Why EZWebOne</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Not a Template Agency
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
              {whyEzWebOne.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
