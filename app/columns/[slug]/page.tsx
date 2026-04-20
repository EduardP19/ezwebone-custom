import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { connection } from "next/server";
import { getPublishedColumnBySlug } from "@/lib/columns";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { createMetadata } from "@/lib/seo";

const FALLBACK_IMAGE = "/blog/placeholder.png";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const column = await getPublishedColumnBySlug(slug, locale);

  if (!column) {
    return createMetadata({
      title: getDictionary(locale).metadata.columns.title,
      description: getDictionary(locale).metadata.columns.description,
      path: "/columns",
      locale,
    });
  }

  return createMetadata({
    title: column.title,
    description: column.subtitle ?? getDictionary(locale).metadata.columns.description,
    path: `/columns/${column.slug}`,
    image: column.coverImage || FALLBACK_IMAGE,
    type: "article",
    locale,
  });
}

export default async function ColumnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const founderTitle = dictionary.common.founder;
  const { slug } = await params;
  const column = await getPublishedColumnBySlug(slug, locale);

  if (!column) {
    notFound();
  }

  return (
    <div className="bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OpinionNewsArticle",
          headline: column.title,
          description: column.subtitle,
          image: [column.coverImage || "https://ezwebone.co.uk/blog/placeholder.png"],
          datePublished: column.createdAt,
          author: [
            {
              "@type": "Person",
              name: column.authorName || "Eduard",
              jobTitle: column.authorRole || `${founderTitle}, EZWebOne`,
              url: "https://ezwebone.co.uk/about",
            },
          ],
        }}
      />

      <div className="relative h-[45vh] min-h-[350px] w-full overflow-hidden">
        <Image
          src={column.coverImage || FALLBACK_IMAGE}
          alt={column.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <Link
                href={localizePath(locale, "/columns")}
                className="group mb-8 inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
              >
                <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {dictionary.pages.columns.backToColumns}
                </span>
              </Link>
              <h1 className="mb-6 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                {column.title}
              </h1>
              {column.subtitle ? (
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/80 md:text-xl">
                  {column.subtitle}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-20 lg:flex-row">
            <aside className="flex-shrink-0 lg:w-64">
              <div className="space-y-12 lg:sticky lg:top-32">
                <div>
                  <h4 className="mb-6 border-l-2 border-brand-purple px-1 text-[10px] font-bold uppercase tracking-widest text-brand-black">
                    {dictionary.pages.columns.published}
                  </h4>
                  <p className="text-sm font-bold text-brand-gray">
                    {new Date(column.createdAt).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="mb-6 border-l-2 border-brand-purple px-1 text-[10px] font-bold uppercase tracking-widest text-brand-black">
                    {dictionary.pages.columns.author}
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-warm font-bold text-brand-purple">
                      {column.authorName?.[0] || "E"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-black">{column.authorName || "Eduard"}</p>
                      <p className="text-[10px] font-medium text-brand-gray">
                        {column.authorRole || founderTitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href={localizePath(locale, "/contact")}>
                    <Button
                      variant="ghost"
                      className="w-full border border-brand-border py-6 text-xs font-black uppercase tracking-widest transition-all hover:bg-brand-black hover:text-white"
                    >
                      {dictionary.pages.columns.joinConversation}
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            <div className="max-w-2xl flex-1">
              <div
                className="prose prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-black prose-p:leading-relaxed prose-p:text-brand-gray prose-strong:text-brand-black prose-li:text-brand-gray"
                dangerouslySetInnerHTML={{ __html: column.content ?? "" }}
              />
            </div>
          </div>
        </div>
      </div>

      <FinalCTA variant="glass" />
    </div>
  );
}
