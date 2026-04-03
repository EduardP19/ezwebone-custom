"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  category: string;
  industry: string;
  image: string;
  description: string;
  summary: string;
  highlights: string[];
  caseStudy?: string | null;
  liveUrl?: string | null;
  className?: string;
}

export function ProjectCard({
  title,
  category,
  industry,
  image,
  description,
  summary,
  highlights,
  caseStudy,
  liveUrl,
  className,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dialogTitleId = React.useId();

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openModal = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal();
          }
        }}
        className={cn(
          "group cursor-pointer overflow-hidden rounded-[1.6rem] border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] text-left transition duration-300 hover:scale-[1.01] hover:border-[rgba(124,58,237,0.5)] hover:shadow-[0_28px_80px_rgba(124,58,237,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-dark)]",
          className
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover object-top" />
        </div>

        <div className="p-6">
          <span className="inline-flex rounded-full border border-white/10 bg-[color:var(--color-bg-elevated)] px-3 py-1 text-xs text-[color:var(--color-text-accent)]">
            {category}
          </span>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
            {title}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--color-text-secondary)]">
            {summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/8 bg-[color:var(--color-bg-elevated)] px-3 py-1 text-xs text-[color:var(--color-text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-text-accent)] transition group-hover:text-white">
            View Details
            <ArrowUpRight size={14} />
          </div>
        </div>
      </article>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-[rgba(5,5,10,0.78)] p-4 backdrop-blur-xl md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(10,10,15,0.96)] shadow-[0_40px_140px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,10,15,0.72)] text-[color:var(--color-text-primary)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
                aria-label={`Close ${title} details`}
              >
                <X size={18} />
              </button>

              <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[260px] bg-[color:var(--color-bg-elevated)] md:min-h-full">
                  <Image src={image} alt={title} fill className="object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.58)] via-transparent to-transparent" />
                </div>

                <div className="min-h-0 overflow-y-auto p-6 md:p-8">
                  <div className="pr-12">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex rounded-full border border-white/10 bg-[color:var(--color-bg-elevated)] px-3 py-1 text-xs text-[color:var(--color-text-accent)]">
                        {category}
                      </span>
                      <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                        {industry}
                      </span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <h3
                        id={dialogTitleId}
                        className="flex-1 text-3xl font-semibold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl"
                      >
                        {title}
                      </h3>
                      {liveUrl ? (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${title} live site`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white/5 text-[color:var(--color-text-accent)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
                        >
                          <ArrowUpRight size={18} />
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-4 text-base leading-7 text-[color:var(--color-text-secondary)]">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                        Overview
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
                        {description}
                      </p>
                    </div>

                    {caseStudy ? (
                      <div>
                        <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                          Case Study
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
                          {caseStudy}
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                        What We Focused On
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {highlights.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-[color:var(--color-bg-elevated)] px-3 py-1.5 text-xs text-[color:var(--color-text-secondary)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[color:var(--color-text-primary)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
                      >
                        Discuss a Similar Project
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
