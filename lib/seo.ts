import type { Metadata } from "next";
import {
  getLocalizedUrlMap,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";

export const siteConfig = {
  name: "EZWebOne",
  url: "https://ezwebone.co.uk",
  title: "EZWebOne | Websites, Automations, and AI Agents for Small Businesses",
  description:
    "EZWebOne is a UK digital agency building websites, automations, AI agents, SEO systems, and lead generation funnels for small businesses that want to grow.",
  ogImage: "/og-image.png",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: readonly string[];
  image?: string;
  type?: "website" | "article";
  locale?: Locale;
};

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
  type = "website",
  locale = "en",
}: MetadataOptions): Metadata {
  const localizedPath = localizePath(locale, path);
  const url = absoluteUrl(localizedPath);
  const imageUrl = absoluteUrl(image);
  const localizedUrls = getLocalizedUrlMap(path);

  return {
    title,
    description,
    keywords: [...keywords],
    alternates: {
      canonical: url,
      languages: {
        "en-GB": absoluteUrl(localizedUrls.en),
        "ro-RO": absoluteUrl(localizedUrls.ro),
        "x-default": absoluteUrl(localizedUrls.en),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === "ro" ? "ro_RO" : "en_GB",
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
