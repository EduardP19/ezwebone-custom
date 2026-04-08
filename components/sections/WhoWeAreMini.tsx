"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";

export function WhoWeAreMini() {
  const { dictionary } = useI18n();
  const copy = dictionary.home.whoWeAre;

  return (
    <section className="section-shell bg-[color:var(--color-bg-dark)] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[rgba(17,17,24,0.72)] px-5 py-6 text-center backdrop-blur-xl sm:px-7 sm:py-7">
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">{copy.badge}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-base sm:leading-8">
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
