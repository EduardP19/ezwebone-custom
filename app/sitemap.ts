import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedBlogPosts();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "/privacy" || path === "/terms" || path === "/cookies" ? ("monthly" as const) : ("weekly" as const),
    priority: path === "" ? 1 : path === "/privacy" || path === "/terms" || path === "/cookies" ? 0.3 : 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
