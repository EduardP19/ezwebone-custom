import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackingProvider } from "@/components/analytics/TrackingProvider";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/og-image.png")],
  },
  icons: {
    icon: [
      { url: "/brand/ez-logo-circle.png", type: "image/png" },
    ],
    shortcut: "/brand/ez-logo-circle.png",
    apple: [
      { url: "/brand/ez-logo-circle.png", type: "image/png" },
    ],
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <TrackingProvider />
        </Suspense>
        <JsonLd
          id="organization-schema"
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "EZWebOne",
            url: "https://ezwebone.co.uk",
            logo: absoluteUrl("/brand/ez-logo-circle.png"),
            description:
              "UK digital agency building websites, automations, AI agents, SEO systems, and lead generation for small businesses.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Hemel Hempstead",
              addressCountry: "UK",
            },
            areaServed: "United Kingdom",
            knowsAbout: [
              "Website design",
              "Business automations",
              "AI agents",
              "SEO",
              "Lead generation",
            ],
            sameAs: ["https://resevia.co.uk"],
          }}
        />
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
