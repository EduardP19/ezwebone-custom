import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Portfolio } from "@/components/sections/Portfolio";
import { AITeaser } from "@/components/sections/AITeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "EZWebOne",
          "url": "https://ezwebone.co.uk",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://ezwebone.co.uk/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <Portfolio />
      <AITeaser />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
