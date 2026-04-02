import type { Metadata } from "next";
import { connection } from "next/server";
import { HeroChatPreview } from "@/components/sections/HeroChatPreview";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Portfolio } from "@/components/sections/Portfolio";
import { AITeaser } from "@/components/sections/AITeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedProjects } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Websites, Automations, and AI Agents for Small Businesses",
  description:
    "EZWebOne is a UK digital agency building websites, automations, AI agents, marketing systems, SEO, and lead generation for small businesses.",
  path: "/",
  keywords: [
    "websites for small businesses uk",
    "automation agency uk",
    "ai agents for small business",
    "lead generation systems uk",
  ],
});

export default async function Home() {
  await connection();
  const projects = await getPublishedProjects();

  return (
    <>
      <JsonLd
        id="website-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "EZWebOne",
          url: "https://ezwebone.co.uk",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://ezwebone.co.uk/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
        }}
      />
      <HeroChatPreview />
      <Services />
      <AITeaser />
      <Portfolio projects={projects} />
      <TrustBar />
      <Testimonials />
      <HowItWorks />
      <FinalCTA />
    </>
  );
}
