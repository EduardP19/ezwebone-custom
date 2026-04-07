import type { Metadata } from "next";
import { TestAgentPageClient } from "@/components/test/TestAgentPageClient";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.test;

  return {
    ...createMetadata({
      title: copy.title,
      description: copy.description,
      path: "/test",
      keywords: copy.keywords,
      locale,
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function TestPage() {
  return <TestAgentPageClient />;
}
