import { Playfair_Display, Cormorant_Garamond, Inter, Montserrat } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bt-heading",
  weight: ["500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bt-subheading",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bt-body",
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bt-ui",
  weight: ["500", "600", "700"],
});

export const metadata = createMetadata({
  title: "Beauty & Aesthetics Digital Agency | EZWebOne",
  description:
    "Premium digital systems for beauty clinics, salons, and aesthetic practitioners: websites, bookings, and automations that elevate client experience.",
  path: "/bt",
  keywords: [
    "beauty clinic website",
    "aesthetics digital agency",
    "salon booking system",
    "clinic automation",
    "luxury salon website",
    "aesthetic practitioner marketing",
  ],
});

export default function BTLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${montserrat.variable}`}
    >
      <JsonLd
        id="bt-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Beauty & Aesthetics Digital Agency | EZWebOne",
          description:
            "We build premium websites, booking journeys, and automations for beauty clinics, salons, and aesthetic professionals.",
          url: "https://ezwebone.co.uk/bt",
          mainEntity: {
            "@type": "Service",
            name: "Beauty & Aesthetics Digital Systems",
            serviceType: "Web Design and Booking Automation",
            provider: {
              "@type": "Organization",
              name: "EZWebOne",
              url: "https://ezwebone.co.uk",
            },
            areaServed: "United Kingdom",
          },
        }}
      />
      {children}
    </div>
  );
}
