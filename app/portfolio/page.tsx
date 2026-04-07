import type { Metadata } from "next";
import { connection } from "next/server";
import { Badge } from "@/components/ui/Badge";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import { getPublishedProjects } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.portfolio;

  return createMetadata({
    title: copy.title,
    description: copy.description,
    path: "/portfolio",
    keywords: copy.keywords,
    locale,
  });
}

export default async function PortfolioPage() {
  await connection();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const projects = await getPublishedProjects(locale);

  return (
    <div className="section-shell bg-[color:var(--color-bg-dark)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_32%)]" />
      <div className="container mx-auto px-4 py-20 md:px-6">
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4">{dictionary.pages.portfolio.badge}</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-[color:var(--color-text-primary)] leading-[0.95] text-balance">
            {dictionary.pages.portfolio.title}
          </h1>
          <p className="mt-5 text-xl text-[color:var(--color-text-secondary)] leading-relaxed">
            {dictionary.pages.portfolio.body}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.slug} {...project} className="h-full" />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 rounded-[1.75rem] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6">
              <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
                {dictionary.common.noPublishedProjects}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <FinalCTA variant="black" />
      </div>
    </div>
  );
}
