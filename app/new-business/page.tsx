import type { Metadata } from "next";
import { connection } from "next/server";
import { HeroChatPreview } from "@/components/sections/HeroChatPreview";
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

  return createMetadata({
    title:
      locale === "ro"
        ? "Pachet de lansare pentru afaceri noi"
        : "New Business Launch Support",
    description:
      locale === "ro"
        ? "Audit rapid si recomandari practice pentru antreprenori romani care au lansat recent o afacere."
        : "Fast audit and practical recommendations for newly registered business owners.",
    path: "/new-business",
    keywords: getDictionary(locale).metadata.home.keywords,
    locale,
  });
}

export default async function NewBusinessLandingPage() {
  await connection();
  const locale = await getRequestLocale();
  const projects = await getPublishedProjects(locale);
  const localizedUrl = absoluteUrl(localizePath(locale, "/new-business"));

  return (
    <>
      <JsonLd
        id="new-business-landing-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name:
            locale === "ro"
              ? "Pachet de lansare pentru afaceri noi"
              : "New Business Launch Support",
          url: localizedUrl,
        }}
      />
      <HeroChatPreview agentKey="prequalifyNewBusiness" />
      <Services />
      <Portfolio projects={projects} />
      <WhoWeAreMini />
      <TrustBar />
      <Testimonials />
      <HowItWorks />
      <FinalCTA />
    </>
  );
}
