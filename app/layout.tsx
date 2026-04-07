import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackingProvider } from "@/components/analytics/TrackingProvider";
import { BRAND_LOGO_MARK_SRC } from "@/lib/brand";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
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
      { url: BRAND_LOGO_MARK_SRC, type: "image/png" },
    ],
    shortcut: BRAND_LOGO_MARK_SRC,
    apple: [
      { url: BRAND_LOGO_MARK_SRC, type: "image/png" },
    ],
  },
  category: "business",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale} dictionary={dictionary}>
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
              logo: absoluteUrl(BRAND_LOGO_MARK_SRC),
              description: dictionary.metadata.siteDescription,
              address: {
                "@type": "PostalAddress",
                addressCountry: "United Kingdom",
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
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
