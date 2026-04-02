import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { connection } from "next/server";
import { estimateReadTime, formatPostDate, getPublishedBlogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Journal",
  description:
    "Read positioning, SEO, paid growth, automation, and digital strategy insights for ambitious UK service businesses.",
  path: "/blog",
  keywords: [
    "marketing strategy blog",
    "service business seo insights",
    "service brand growth articles",
  ],
});

const FALLBACK_IMAGE = "/blog/ai.png";

export default async function BlogPage() {
  await connection();
  const posts = await getPublishedBlogPosts();

  return (
    <div className="section-shell bg-[color:var(--color-bg-dark)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_32%)]" />
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-3xl mb-14 md:mb-16">
          <Badge className="mb-4">Journal</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-[color:var(--color-text-primary)] mb-6">
            Strategy notes for service brands that want to look sharper and grow with intent.
          </h1>
          <p className="text-xl text-[color:var(--color-text-secondary)] leading-relaxed">
            Essays on positioning, search visibility, paid growth, automation, and the systems behind better-fit enquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                <Card
                  padding="sm"
                  className="h-full border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all group hover:border-[rgba(124,58,237,0.4)]"
                >
                  <div className="aspect-[16/9] bg-[color:var(--color-bg-elevated)] rounded-xl mb-5 overflow-hidden relative">
                    <Image
                      src={post.cover_image || FALLBACK_IMAGE}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[color:var(--color-text-secondary)] uppercase tracking-widest mb-3">
                    <span>{formatPostDate(post.created_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-[color:var(--color-text-secondary)]/60" />
                    <span>{estimateReadTime(post.content)} min read</span>
                  </div>
                  <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] mb-2 group-hover:text-[color:var(--color-primary-light)] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[color:var(--color-text-secondary)] text-sm leading-relaxed line-clamp-3">
                    {post.excerpt || "Read this latest update from EZWebOne."}
                  </p>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="md:col-span-2 border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]">
              <p className="text-[color:var(--color-text-secondary)] text-sm">No published posts yet.</p>
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
