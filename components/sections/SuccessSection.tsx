"use client";

import { Check } from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { CALENDLY_BOOKING_URL } from "@/lib/links";

export function SuccessSection() {
  const { dictionary } = useI18n();

  return (
    <section className="section-shell relative overflow-hidden pb-28 pt-20 md:pb-36 md:pt-24">
      {/* Orange gradient background — slightly reduced intensity */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(249,115,22,0.12)_0%,rgba(251,146,60,0.07)_50%,transparent_100%)]" />
      <div className="pointer-events-none absolute -top-16 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-400/14 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
      {/* Fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
      {/* 1px divider line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[color:var(--color-border)]" />

      <div className="relative z-10 mx-auto max-w-lg px-4 text-center md:px-6">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <Check className="h-8 w-8 text-emerald-500" strokeWidth={2.5} />
        </span>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          {dictionary.common.guideEmailOnTheWayTitle}
        </h1>

        <p className="mt-4 text-base leading-7 text-[color:var(--color-text-secondary)]">
          {dictionary.common.guideEmailBodyPrefix}{" "}
          <span className="font-medium text-[color:var(--color-text-primary)]">
            {dictionary.common.guideEmailSpamFolder}
          </span>
          .
        </p>

        <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] p-6">
          <p className="text-sm font-medium text-[color:var(--color-text-secondary)]">
            {dictionary.common.guideEmailCtaQuestion}
          </p>
          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            data-track-label="stampuser:guides-success-book-call"
            className="mt-4 inline-block w-full"
          >
            <Button size="md" className="w-full">
              {dictionary.common.bookFreeCall}
            </Button>
          </a>
          <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">
            {dictionary.common.guideEmailCtaFootnote}
          </p>
        </div>
      </div>
    </section>
  );
}
