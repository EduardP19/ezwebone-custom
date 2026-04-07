import type { MetadataRoute } from "next";
import { locales, localizePath } from "@/lib/i18n/config";
import { getPublishedBlogPosts } from "@/lib/blog";
import { getPublishedColumns } from "@/lib/columns";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, columns] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedColumns(),
  ]);

  const baseStaticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/contact",
    "/blog",
    "/columns",
    "/privacy",
    "/terms",
    "/cookies",
  ];

  const staticRoutes = locales.flatMap((locale) =>
    baseStaticRoutes.map((path) => ({
      url: absoluteUrl(localizePath(locale, path || "/")),
      lastModified: new Date(),
      changeFrequency:
        path === "/privacy" || path === "/terms" || path === "/cookies"
          ? ("monthly" as const)
          : ("weekly" as const),
      priority: path === "" ? 1 : path === "/privacy" || path === "/terms" || path === "/cookies" ? 0.3 : 0.7,
    }))
  );

  const blogRoutes = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: absoluteUrl(localizePath(locale, `/blog/${post.slug}`)),
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const columnRoutes = locales.flatMap((locale) =>
    columns.map((column) => ({
      url: absoluteUrl(localizePath(locale, `/columns/${column.slug}`)),
      lastModified: new Date(column.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...blogRoutes, ...columnRoutes];
}
