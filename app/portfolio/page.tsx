import type { Metadata } from "next";
import { connection } from "next/server";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { FinalCTA } from "@/components/sections/FinalCTA";
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
    <div className="py-20 bg-[#fbf7f1]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <Badge className="mb-4">Selected Work</Badge>
          <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-brand-black leading-[0.95] text-balance">
            A look at the kind of clarity and confidence we build into every project.
          </h1>
          <p className="mt-5 text-xl text-brand-gray leading-relaxed">
            These projects vary by sector, but they share the same goal: make the brand feel more trusted, more valuable, and easier to buy from.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.slug} padding="sm" className="group h-full">
                <div className="aspect-[4/5] bg-brand-warm rounded-[1.25rem] mb-5 overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <Badge className="mb-3">{project.industry}</Badge>
                <h2 className="text-2xl font-display font-semibold text-brand-black mb-3">{project.title}</h2>
                <p className="text-brand-gray leading-relaxed">{project.summary}</p>
              </Card>
            ))
          ) : (
            <Card padding="sm" className="md:col-span-2 lg:col-span-3">
              <p className="text-brand-gray leading-relaxed">
                No published projects yet. Add rows to the <code>projects</code> table to populate this page.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-16">
        <FinalCTA variant="black" />
      </div>
    </div>
  );
}
