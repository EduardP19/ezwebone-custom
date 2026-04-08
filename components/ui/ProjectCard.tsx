"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { ArrowUpRight, X } from "lucide-react";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  category: string;
  industry: string;
  image: string;
  beforeImage?: string | null;
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
  beforeImage,
  description,
  summary,
  highlights,
  caseStudy,
  liveUrl,
  className,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<"before" | "after">("after");
  const dialogTitleId = React.useId();
  const { dictionary } = useI18n();
  const hasBeforeImage = Boolean(beforeImage);
  const activeImage = previewMode === "before" && beforeImage ? beforeImage : image;

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

  React.useEffect(() => {
    if (!isOpen) return;
    setPreviewMode("after");
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
        data-track-label={`Open project modal: ${title}`}
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
        <div className="relative aspect-[16/11] overflow-hidden bg-[color:var(--color-bg-elevated)] md:aspect-[16/10]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top"
            style={{ objectPosition: "center top" }}
          />
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
            {dictionary.common.viewDetails}
            <ArrowUpRight size={14} />
          </div>
        </div>
      </article>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto bg-[rgba(5,5,10,0.78)] p-4 backdrop-blur-xl md:items-center md:p-6"
            data-track-label={`Project modal backdrop: ${title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              data-track-label={`Project modal content: ${title}`}
              className="relative my-4 flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-y-auto rounded-[2rem] border border-[color:var(--color-border)] bg-[rgba(10,10,15,0.96)] shadow-[0_40px_140px_rgba(0,0,0,0.45)] md:my-0 md:max-h-[90vh] md:overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                data-track-label={`Close project modal: ${title}`}
                className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,10,15,0.72)] text-[color:var(--color-text-primary)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
                aria-label={`${dictionary.common.closeDetails}: ${title}`}
              >
                <X size={18} />
              </button>

              <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[320px] bg-[color:var(--color-bg-elevated)] md:min-h-full">
                  <Image
                    src={activeImage}
                    alt={title}
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: "center top" }}
                  />
                  {hasBeforeImage ? (
                    <div className="absolute left-4 top-4 z-[1] rounded-2xl border border-white/15 bg-[rgba(10,10,15,0.78)] p-2.5 backdrop-blur">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-accent)]">
                        Compare Views
                      </p>
                      <div className="inline-flex rounded-full border border-white/15 bg-black/25 p-1">
                        <button
                          type="button"
                          onClick={() => setPreviewMode("before")}
                          data-track-label={`Project preview before: ${title}`}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                            previewMode === "before"
                              ? "bg-[color:var(--color-text-accent)] text-[color:var(--color-bg-dark)] shadow-[0_8px_22px_rgba(201,169,110,0.45)]"
                              : "text-[color:var(--color-text-secondary)] hover:text-white"
                          )}
                        >
                          BEFORE
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode("after")}
                          data-track-label={`Project preview after: ${title}`}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                            previewMode === "after"
                              ? "bg-[color:var(--color-text-accent)] text-[color:var(--color-bg-dark)] shadow-[0_8px_22px_rgba(201,169,110,0.45)]"
                              : "text-[color:var(--color-text-secondary)] hover:text-white"
                          )}
                        >
                          AFTER
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {hasBeforeImage ? (
                    <div className="absolute bottom-4 left-4 z-[1] rounded-full border border-[color:var(--color-text-accent)]/60 bg-[rgba(10,10,15,0.78)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-accent)] backdrop-blur">
                      {previewMode === "before" ? "Before snapshot" : "After snapshot"}
                    </div>
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.58)] via-transparent to-transparent" />
                </div>

                <div className="min-h-0 p-6 md:overflow-y-auto md:p-8">
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
                    </div>
                    <p className="mt-4 text-base leading-7 text-[color:var(--color-text-secondary)]">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                        {dictionary.common.overview}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
                        {description}
                      </p>
                    </div>

                    {caseStudy ? (
                      <div>
                        <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                          {dictionary.common.caseStudy}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
                          {caseStudy}
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
                        {dictionary.common.whatWeFocusedOn}
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
                      <a
                        href={CALENDLY_BOOKING_URL}
                        target="_blank"
                        rel="noreferrer"
                        data-track-label={`Discuss project: ${title}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[color:var(--color-text-primary)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
                      >
                        {dictionary.common.discussSimilarProject}
                      </a>
                      {liveUrl ? (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-track-label={`Go to website: ${title}`}
                          aria-label={`${dictionary.common.openLiveSite}: ${title}`}
                          className="inline-flex items-center rounded-full bg-[rgba(109,40,217,0.9)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-text-accent)]"
                        >
                          Go to Website
                        </a>
                      ) : null}
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
