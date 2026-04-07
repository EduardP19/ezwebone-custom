import { cache } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedBlogFields } from "@/lib/blog-content";
import { supabase } from "@/lib/supabase";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
}

const blogSelect = "id, slug, title, excerpt, content, cover_image, published, created_at";

function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  const localized = getLocalizedBlogFields(post.slug, locale);

  if (!localized) {
    return post;
  }

  return {
    ...post,
    title: localized.title,
    excerpt: localized.excerpt,
    content: localized.content,
  };
}

export const getPublishedBlogPosts = cache(async (locale: Locale = "en"): Promise<BlogPost[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("blog")
    .select(blogSelect)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load blog posts: ${error.message}`);
  }

  return ((data ?? []) as BlogPost[]).map((post) => localizeBlogPost(post, locale));
});

export const getPublishedBlogPostBySlug = cache(
  async (slug: string, locale: Locale = "en"): Promise<BlogPost | null> => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("blog")
      .select(blogSelect)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load blog post: ${error.message}`);
    }

    return data ? localizeBlogPost(data as BlogPost, locale) : null;
  }
);

export function estimateReadTime(content: string | null): number {
  if (!content) return 1;
  const withoutTags = content.replace(/<[^>]*>/g, " ");
  const words = withoutTags.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatPostDate(dateIso: string, locale: Locale = "en"): string {
  return new Date(dateIso).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isHtmlContent(content: string | null): boolean {
  if (!content) return false;
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export function plainTextFromContent(content: string | null): string {
  if (!content) return "";
  return content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
