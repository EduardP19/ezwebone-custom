"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface PortfolioProps {
  projects: Project[];
}

export function Portfolio({ projects }: PortfolioProps) {
  const { dictionary } = useI18n();

  return (
    <section id="projects" className="section-shell section-shift section-shift-purple bg-[color:var(--color-bg-dark)] py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
            {dictionary.home.portfolio.badge}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
            {dictionary.home.portfolio.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[color:var(--color-text-secondary)]">
            {dictionary.home.portfolio.body}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className={project.featured || index === 0 ? "lg:col-span-2" : ""}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
