import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/site-content";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { BusinessJourney } from "@/components/sections/BusinessJourney";

export const metadata: Metadata = createMetadata({
  title: "Services | Websites, Automations, AI Agents, SEO and Lead Gen",
  description:
    "Explore EZWebOne services: custom websites, automations, AI agents, marketing, SEO, and lead generation systems for small businesses.",
  path: "/services",
  keywords: [
    "website agency uk",
    "business automation agency",
    "ai agents for salons and small business",
    "seo and lead generation services",
  ],
});

export default function ServicesPage() {
  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <JsonLd
        id="services-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              provider: {
                "@type": "Organization",
                name: "EZWebOne",
              },
            },
          })),
        }}
      />

      <section className="section-shell py-28 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="max-w-3xl">
              <p className="mono-label text-xs text-[color:var(--color-text-accent)]">Services</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
                Websites, automations, AI agents, and the systems that make them useful.
              </h1>
              <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-secondary)]">
                We build for small businesses that want more leads, less admin, and digital systems that keep working after launch.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact">
                  <Button size="lg">Book a Free Call</Button>
                </Link>
                <Link href="/portfolio">
                  <Button size="lg" variant="secondary">
                    See Projects
                  </Button>
                </Link>
              </div>
            </div>

            <BusinessJourney />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
