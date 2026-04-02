import type { Metadata } from "next";
import { connection } from "next/server";
import { Badge } from "@/components/ui/Badge";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getPublishedProjects } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Selected Work and Website Case Studies",
  description:
    "Browse selected EZWebOne projects and see how sharper positioning, better marketing systems, and stronger digital execution improve trust and conversion.",
  path: "/portfolio",
  keywords: ["marketing agency portfolio uk", "service brand case studies", "digital marketing systems for service brands"],
});

export default async function PortfolioPage() {
  await connection();
  const projects = await getPublishedProjects();

  return (
    <div className="section-shell bg-[color:var(--color-bg-dark)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_32%)]" />
      <div className="container mx-auto px-4 py-20 md:px-6">
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4">Selected Work</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-[color:var(--color-text-primary)] leading-[0.95] text-balance">
            A look at the kind of clarity and confidence we build into every project.
          </h1>
          <p className="mt-5 text-xl text-[color:var(--color-text-secondary)] leading-relaxed">
            These projects vary by sector, but they share the same goal: make the brand feel more trusted, more valuable, and easier to buy from.
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
                No published projects yet. Add rows to the <code>projects</code> table to populate this page.
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
