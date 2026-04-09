import type { Metadata } from "next";
import { connection } from "next/server";
import { Badge } from "@/components/ui/Badge";
import { ColumnCard } from "@/components/ui/ColumnCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { getPublishedColumns } from "@/lib/columns";
import { getColumnViewsBySlug } from "@/lib/contentViews";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.columns;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/columns",
    keywords: copy.keywords,
    locale,
  });
}

export default async function ColumnsPage() {
  await connection();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const columns = await getPublishedColumns(locale);
  const viewsBySlug = await getColumnViewsBySlug(columns.map((column) => column.slug));

  function estimateReadTime(content: string | null) {
    if (!content) return 1;
    const withoutTags = content.replace(/<[^>]*>/g, " ");
    const words = withoutTags.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
  }

  return (
    <div className="bg-[#fafafa]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: locale === "ro" ? "Coloanele EZWebOne" : "EZWebOne Columns",
          itemListElement: columns.map((column, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(localizePath(locale, `/columns/${column.slug}`)),
            name: column.title,
          })),
        }}
      />

      <div className="container mx-auto px-4 py-20 md:px-6">
        <div className="mb-20 max-w-3xl">
          <Badge className="mb-4">{dictionary.pages.columns.badge}</Badge>
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-brand-black md:text-6xl">
            {dictionary.pages.columns.title}
          </h1>
          <p className="text-xl leading-relaxed text-brand-gray">{dictionary.pages.columns.body}</p>
        </div>

        {columns.length > 0 ? (
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
            {columns.map((column) => (
              <ColumnCard
                key={column.id}
                slug={column.slug}
                title={column.title}
                subtitle={column.subtitle ?? undefined}
                coverImage={column.coverImage ?? undefined}
                publishedAt={column.createdAt}
                readTime={estimateReadTime(column.content)}
                views={viewsBySlug[column.slug] ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-border bg-white p-6 text-brand-gray">
            {dictionary.common.noPublishedColumns}
          </div>
        )}
      </div>

      <FinalCTA variant="black" />
    </div>
  );
}
