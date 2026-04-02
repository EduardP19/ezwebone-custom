import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/ContactPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact EZWebOne",
  description:
    "Start a project with EZWebOne and discuss positioning, SEO, paid growth, websites, and automation for your business.",
  path: "/contact",
  keywords: ["contact marketing agency", "book strategy call", "service brand marketing enquiry"],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        id="contact-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact EZWebOne",
          url: "https://ezwebone.co.uk/contact",
          description:
            "Contact EZWebOne to discuss positioning, websites, SEO, paid growth, and automation for your business.",
        }}
      />
      <ContactPageClient />
    </>
  );
}
