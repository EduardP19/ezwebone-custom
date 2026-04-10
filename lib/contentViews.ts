import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ViewMap = Record<string, number>;

function safeSlug(slug: string) {
  return slug.replace(/[^a-zA-Z0-9-]/g, "");
}

async function countViewsForPaths(paths: string[]) {
  if (!supabaseAdmin || paths.length === 0) {
    return 0;
  }

  const filters: string[] = [];
  for (const path of paths) {
    filters.push(`page_path.eq.${path}`);
    filters.push(`page_path.like.${path}?%`);
  }

  const { count, error } = await supabaseAdmin
    .from("logs-eduarddev")
    .select("*", { head: true, count: "exact" })
    .eq("event_name", "page_view")
    .or(filters.join(","));

  if (error) {
    throw new Error(`Failed to count views: ${error.message}`);
  }

  return count ?? 0;
}

export const getBlogViewsBySlug = cache(async (slugs: string[]): Promise<ViewMap> => {
  const result: ViewMap = {};

  for (const rawSlug of slugs) {
    const slug = safeSlug(rawSlug);
    if (!slug) {
      result[rawSlug] = 0;
      continue;
    }

    const paths = [`/blog/${slug}`, `/ro/blog/${slug}`];
    result[rawSlug] = await countViewsForPaths(paths);
  }

  return result;
});

export const getColumnViewsBySlug = cache(async (slugs: string[]): Promise<ViewMap> => {
  const result: ViewMap = {};

  for (const rawSlug of slugs) {
    const slug = safeSlug(rawSlug);
    if (!slug) {
      result[rawSlug] = 0;
      continue;
    }

    const paths = [`/columns/${slug}`, `/ro/columns/${slug}`];
    result[rawSlug] = await countViewsForPaths(paths);
  }

  return result;
});
