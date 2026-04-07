import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/ContactPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.contact;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/contact",
    keywords: copy.keywords,
    locale,
  });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return (
    <>
      <JsonLd
        id="contact-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: dictionary.metadata.contact.title,
          url: absoluteUrl(localizePath(locale, "/contact")),
          description: dictionary.metadata.contact.description,
        }}
      />
      <ContactPageClient />
    </>
  );
}
