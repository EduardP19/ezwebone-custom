import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, createMetadata } from "@/lib/seo";

const STATS = [
  { label: "Years in digital", value: "5" },
  { label: "Business partners", value: "115+" },
  { label: "Websites launched", value: "154" },
  { label: "Countries served", value: "6" },
];

const PRINCIPLES = [
  {
    title: "Specific beats generic",
    description:
      "We do not write fluffy agency copy or hide weak offers behind nice visuals. Everything has to be clear, direct, and useful to the buyer.",
  },
  {
    title: "Automation should remove work",
    description:
      "If a system adds friction, it is not automation. We build flows that save time, answer faster, and keep leads moving without more admin.",
  },
  {
    title: "AI should feel practical",
    description:
      "The goal is not to say your business uses AI. The goal is to use it where it makes money or saves time - calls, follow-up, booking, and lead qualification.",
  },
];

export const metadata: Metadata = createMetadata({
  title: "About EZWebOne",
  description:
    "Learn about EZWebOne, the UK digital agency building websites, automations, AI agents, and growth systems for small businesses.",
  path: "/about",
  keywords: ["about ezwebone", "uk digital agency", "web automation ai agency uk"],
});

export default function AboutPage() {
  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <JsonLd
        id="about-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "EZWebOne",
          image: absoluteUrl("/brand/ez-logo-circle.png"),
          "@id": "https://ezwebone.co.uk/about",
          url: "https://ezwebone.co.uk/about",
          description:
            "UK digital agency building websites, automations, AI agents, and lead generation systems for small businesses.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Hemel Hempstead",
            addressRegion: "Hertfordshire",
            addressCountry: "GB",
          },
          founder: {
            "@type": "Person",
            name: "Eduard",
          },
        }}
      />

      <section className="section-shell py-28 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="max-w-3xl">
              <p className="mono-label text-xs text-[color:var(--color-text-accent)]">About EZWebOne</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
                Built for small businesses that need real systems, not more noise.
              </h1>
              <div className="mt-8 space-y-6 text-lg leading-8 text-[color:var(--color-text-secondary)]">
                <p>
                  EZWebOne started as a web design service and grew into something more useful: a digital agency that builds the full system around growth.
                </p>
                <p>
                  That means the website, the automation behind it, the AI tools that answer faster, and the lead generation flow that turns interest into paying customers.
                </p>
                <p>
                  We are based in Hemel Hempstead and work with small businesses across the UK that want to look sharper, move faster, and stop losing opportunities to slow processes.
                </p>
              </div>

              <div className="mt-10">
                <Link href="/contact">
                  <Button size="lg">Book a Free Call</Button>
                </Link>
              </div>
            </div>

            <div className="surface-elevated rounded-[2rem] border border-white/10 p-8">
              <p className="mono-label text-xs text-[color:var(--color-text-secondary)]">What we care about</p>
              <div className="mt-6 space-y-8">
                {PRINCIPLES.map((item) => (
                  <div key={item.title}>
                    <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                      {item.title}
                    </h2>
                    <p className="mt-3 leading-7 text-[color:var(--color-text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="surface-card p-6 text-center">
                <p className="text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
