import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createMetadata({
  title: "Health & Wellness Digital Agency | EZWebOne",
  description: "We build high-performance websites, booking systems, and AI automations for gyms, wellness studios, therapists, and nutritionists to scale revenue.",
  path: "/hf",
  keywords: [
    "health website design", 
    "wellness digital agency", 
    "gym marketing", 
    "booking automation", 
    "nutritionist website", 
    "yoga studio booking system"
  ],
});

export default function HFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd 
        id="hf-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Health & Wellness Digital Agency | EZWebOne",
          description: "We build high-performance websites, booking systems, and AI automations for gyms, wellness studios, therapists, and nutritionists.",
          url: "https://ezwebone.co.uk/hf",
          mainEntity: {
            "@type": "Service",
            name: "Health & Wellness Digital Systems",
            serviceType: "Web Design and Business Automation",
            provider: {
              "@type": "Organization",
              name: "EZWebOne",
              url: "https://ezwebone.co.uk"
            },
            areaServed: "United Kingdom",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Wellness Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Booking Integration"
                  }
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "AI Agents & Automations"
                  }
                }
              ]
            }
          }
        }}
      />
      {children}
    </>
  );
}
