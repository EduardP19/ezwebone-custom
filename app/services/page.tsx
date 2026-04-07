import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { createMetadata } from "@/lib/seo";
import { getServices } from "@/lib/site-content";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { BusinessJourney } from "@/components/sections/BusinessJourney";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.services;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/services",
    keywords: copy.keywords,
    locale,
  });
}

export default async function ServicesPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const services = getServices(locale);

  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <JsonLd
        id="services-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((service, index) => ({
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
              <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                {dictionary.pages.services.badge}
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
                {dictionary.pages.services.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-[color:var(--color-text-secondary)]">
                {dictionary.pages.services.body}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href={localizePath(locale, "/contact")}>
                  <Button size="lg">{dictionary.common.bookFreeCall}</Button>
                </Link>
                <Link href={localizePath(locale, "/portfolio")}>
                  <Button size="lg" variant="secondary">
                    {dictionary.common.seeProjects}
                  </Button>
                </Link>
              </div>
            </div>

            <BusinessJourney />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
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
