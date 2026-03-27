import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EZWebOne — Web Design & Digital Growth Agency",
  description: "We design and build fast, conversion-focused websites for UK small businesses. Delivered in 5 days. Fully yours from day one.",
  openGraph: {
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "EZWebOne",
            "url": "https://ezwebone.co.uk",
            "logo": "https://ezwebone.co.uk/logo.png",
            "description": "Premium web design and digital growth agency for UK small businesses.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Hemel Hempstead",
              "addressCountry": "UK"
            }
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
