import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { connection } from "next/server";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { estimateReadTime, formatPostDate, getPublishedBlogPosts } from "@/lib/blog";
import { getBlogViewsBySlug } from "@/lib/contentViews";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.blog;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/blog",
    keywords: copy.keywords,
    locale,
  });
}

const FALLBACK_IMAGE = "/blog/ai.png";

export default async function BlogPage() {
  await connection();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const posts = await getPublishedBlogPosts(locale);
  const viewsBySlug = await getBlogViewsBySlug(posts.map((post) => post.slug));

  return (
    <div className="section-shell bg-[color:var(--color-bg-dark)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_32%)]" />
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-3xl mb-14 md:mb-16">
          <Badge className="mb-4">{dictionary.pages.blog.badge}</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-[color:var(--color-text-primary)] mb-6">
            {dictionary.pages.blog.title}
          </h1>
          <p className="text-xl text-[color:var(--color-text-secondary)] leading-relaxed">
            {dictionary.pages.blog.body}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={localizePath(locale, `/blog/${post.slug}`)}
                className="block h-full"
              >
                <Card
                  padding="sm"
                  className="h-full border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_16px_36px_rgba(28,42,68,0.12)] transition-all group hover:border-[rgba(124,58,237,0.35)]"
                >
                  <div className="aspect-[16/10] bg-[color:var(--color-bg-elevated)] rounded-xl mb-5 overflow-hidden relative">
                    <Image
                      src={post.cover_image || FALLBACK_IMAGE}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mb-1 text-sm text-[color:var(--color-text-secondary)]">Eduard Proca</div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
                    <span>{formatPostDate(post.created_at, locale)}</span>
                    <span>·</span>
                    <span>
                      {estimateReadTime(post.content)} {dictionary.common.minRead}
                    </span>
                    <span>·</span>
                    <span>{viewsBySlug[post.slug] ?? 0} views</span>
                  </div>
                  <h2 className="text-[2rem] font-semibold text-[color:var(--color-text-primary)] mb-3 leading-[1.15] tracking-tight group-hover:text-[color:var(--color-primary-light)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[color:var(--color-text-secondary)] text-base leading-relaxed line-clamp-3">
                    {post.excerpt || dictionary.pages.blog.fallbackExcerpt}
                  </p>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="md:col-span-2 border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]">
              <p className="text-[color:var(--color-text-secondary)] text-sm">
                {dictionary.common.noPublishedPosts}
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-20">
        <FinalCTA variant="glass" />
      </div>
    </div>
  );
}
