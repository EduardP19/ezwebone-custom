import type { Metadata } from "next";

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
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
};

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
  type = "website",
}: MetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_GB",
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
