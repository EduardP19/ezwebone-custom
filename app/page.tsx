import type { Metadata } from "next";
import { connection } from "next/server";
import { HeroChatPreview } from "@/components/sections/HeroChatPreview";
import { FaqSection } from "@/components/guides/FaqSection";
import { WhoWeAreMini } from "@/components/sections/WhoWeAreMini";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { getPublishedProjects } from "@/lib/projects";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.home;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/",
    keywords: copy.keywords,
    locale,
  });
}

export default async function Home() {
  await connection();
  const locale = await getRequestLocale();
  const projects = await getPublishedProjects(locale);
  const localizedHomeUrl = absoluteUrl(localizePath(locale, "/"));

  return (
    <>
      <JsonLd
        id="website-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "EZWebOne",
          url: localizedHomeUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: "https://ezwebone.co.uk/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
        }}
      />
      <HeroChatPreview />
      <Services />
      <Portfolio projects={projects} />
      <WhoWeAreMini />
      <TrustBar />
      <Testimonials />
      <HowItWorks />
      <FaqSection
        audience="ezwebone"
        locale={locale}
        title={locale === "ro" ? "Intrebari Generale" : "General FAQs"}
        subtitle={
          locale === "ro"
            ? "Intrebari frecvente despre website-uri, automatizari si implementare."
            : "Common questions about websites, automation, and implementation."
        }
      />
      <FinalCTA />
    </>
  );
}
