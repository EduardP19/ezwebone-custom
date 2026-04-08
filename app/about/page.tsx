import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_LOGO_MARK_SRC } from "@/lib/brand";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import { getStats } from "@/lib/site-content";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.about;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/about",
    keywords: copy.keywords,
    locale,
  });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const stats = getStats(locale);

  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <JsonLd
        id="about-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "EZWebOne",
          image: absoluteUrl(BRAND_LOGO_MARK_SRC),
          "@id": absoluteUrl(localizePath(locale, "/about")),
          url: absoluteUrl(localizePath(locale, "/about")),
          description: dictionary.metadata.about.description,
          address: {
            "@type": "PostalAddress",
            addressCountry: "United Kingdom",
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
              <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                {dictionary.pages.about.badge}
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
                {dictionary.pages.about.title}
              </h1>
              <div className="mt-8 space-y-6 text-lg leading-8 text-[color:var(--color-text-secondary)]">
                {dictionary.pages.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10">
                <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer">
                  <Button size="lg">{dictionary.common.bookFreeCall}</Button>
                </a>
              </div>
            </div>

            <div className="surface-elevated rounded-[2rem] border border-white/10 p-8">
              <p className="mono-label text-xs text-[color:var(--color-text-secondary)]">
                {dictionary.pages.about.valuesTitle}
              </p>
              <div className="mt-6 space-y-8">
                {dictionary.pages.about.principles.map((item) => (
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
            {stats.map((stat) => (
              <div key={stat.label} className="surface-card p-6 text-center">
                <p className="text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                  {stat.value}
                  {stat.suffix}
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
