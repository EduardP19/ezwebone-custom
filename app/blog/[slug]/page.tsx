import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { connection } from "next/server";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import {
  estimateReadTime,
  formatPostDate,
  getPublishedBlogPostBySlug,
  isHtmlContent,
  plainTextFromContent,
} from "@/lib/blog";
import { createMetadata } from "@/lib/seo";

const FALLBACK_IMAGE = "/blog/ai.png";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug, locale);

  if (!post) {
    return createMetadata({
      title: getDictionary(locale).metadata.blog.title,
      description: getDictionary(locale).metadata.blog.description,
      path: "/blog",
      locale,
    });
  }

  const description = post.excerpt || plainTextFromContent(post.content).slice(0, 155);

  return createMetadata({
    title: post.title,
    description,
    path: `/blog/${post.slug}`,
    image: post.cover_image || FALLBACK_IMAGE,
    type: "article",
    locale,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content);
  const content = post.content?.trim() || "";
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const showHtml = isHtmlContent(content);

  return (
    <div className="bg-[color:var(--color-bg-dark)]">
      <JsonLd
        id="blog-post-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || plainTextFromContent(post.content).slice(0, 155),
          image: [post.cover_image || "https://ezwebone.co.uk/blog/ai.png"],
          datePublished: post.created_at,
          author: [
            {
              "@type": "Person",
              name: "Eduard",
              url: "https://ezwebone.co.uk/about",
            },
          ],
        }}
      />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-primary-rgb),0.16),transparent_32%)]" />
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 relative">
          <Link
            href={localizePath(locale, "/blog")}
            className="inline-flex items-center gap-2 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors mb-8 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {dictionary.common.backToBlog}
            </span>
          </Link>

          <div className="max-w-4xl">
            <Badge className="mb-4">{dictionary.pages.blogPost.journalEntry}</Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[color:var(--color-text-primary)] mb-5 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm md:text-base text-[color:var(--color-text-secondary)] flex flex-wrap items-center gap-x-3 gap-y-1 uppercase tracking-[0.15em] font-bold">
              <span>{formatPostDate(post.created_at, locale)}</span>
              <span className="w-1 h-1 rounded-full bg-[color:var(--color-text-secondary)]/50" />
              <span>
                {readTime} {dictionary.common.minRead}
              </span>
            </p>
            {post.excerpt && (
              <p className="mt-5 text-lg md:text-xl text-[color:var(--color-text-secondary)] leading-relaxed max-w-3xl">{post.excerpt}</p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 pb-16 md:pb-24">
        <div className="relative w-full h-[220px] md:h-[420px] bg-[color:var(--color-bg-elevated)] rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-12 border border-[color:var(--color-border)]">
          <Image
            src={post.cover_image || FALLBACK_IMAGE}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8 md:gap-10">
          <article>
            {showHtml ? (
              <div
                className="prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[color:var(--color-text-primary)] prose-p:text-[color:var(--color-text-secondary)] prose-p:leading-8 prose-a:text-[color:var(--color-primary)] prose-strong:text-[color:var(--color-text-primary)] prose-li:text-[color:var(--color-text-secondary)] prose-blockquote:text-[color:var(--color-text-secondary)] prose-blockquote:border-[color:var(--color-border)] prose-code:text-[color:var(--color-text-primary)] prose-hr:border-[color:var(--color-border)]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${post.id}-p-${index}`} className="text-[color:var(--color-text-secondary)] text-lg leading-8">
                    {paragraph}
                  </p>
                ))}
                {paragraphs.length === 0 && (
                  <p className="text-[color:var(--color-text-secondary)] text-lg leading-8">
                    {dictionary.pages.blogPost.noContent}
                  </p>
                )}
              </div>
            )}
          </article>

          <aside className="lg:pl-2">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-5 md:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--color-text-primary)] mb-4">
                {dictionary.pages.blogPost.onThisPage}
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[color:var(--color-text-secondary)] uppercase text-[10px] tracking-[0.16em] font-bold mb-1">
                    {dictionary.pages.blogPost.published}
                  </p>
                  <p className="text-[color:var(--color-text-primary)] font-semibold">
                    {formatPostDate(post.created_at, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-[color:var(--color-text-secondary)] uppercase text-[10px] tracking-[0.16em] font-bold mb-1">
                    {dictionary.pages.blogPost.readingTime}
                  </p>
                  <p className="text-[color:var(--color-text-primary)] font-semibold">
                    {readTime} {dictionary.pages.blogPost.minuteRead}
                  </p>
                </div>
                <div>
                  <p className="text-[color:var(--color-text-secondary)] uppercase text-[10px] tracking-[0.16em] font-bold mb-1">
                    {dictionary.pages.blogPost.topic}
                  </p>
                  <p className="text-[color:var(--color-text-primary)] font-semibold">
                    {dictionary.common.growthAndDigitalStrategy}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-[color:var(--color-border)]">
                <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-xs font-black uppercase tracking-widest border border-[color:var(--color-border)] py-6 hover:bg-[color:var(--color-primary)] hover:text-white hover:border-[color:var(--color-primary)] transition-all"
                  >
                    {dictionary.common.bookStrategyCall}
                  </Button>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-20 md:pb-24">
        <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[color:var(--color-text-primary)] mb-4">
            {dictionary.common.readyToTurnIdeas}
          </h2>
          <p className="text-[color:var(--color-text-secondary)] mb-6 max-w-2xl mx-auto leading-relaxed">
            {dictionary.common.turnIdeasBody}
          </p>
          <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer">
            <Button size="lg">{dictionary.common.bookFreeCallToday}</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
