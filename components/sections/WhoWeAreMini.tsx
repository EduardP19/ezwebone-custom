"use client";

import { useI18n } from "@/components/i18n/LocaleProvider";
import { useIsDark } from "@/lib/useTheme";
import { cn } from "@/lib/utils";

export function WhoWeAreMini() {
  const { dictionary } = useI18n();
  const copy = dictionary.home.whoWeAre;
  const isDark = useIsDark();
  const body = isDark ? copy.body : copy.bodyLight;

  return (
    <section
      className={cn(
        "section-shell section-shift section-shift-neutral py-10 sm:py-12",
        isDark
          ? "bg-[color:var(--color-bg-dark)]"
          : "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className={cn(
            "mx-auto max-w-3xl rounded-3xl px-5 py-6 text-center backdrop-blur-xl sm:px-7 sm:py-7",
            isDark
              ? "border border-white/10 bg-[rgba(17,17,24,0.72)]"
              : "border border-[color:var(--color-border)]/70 bg-[rgba(255,255,255,0.88)] shadow-[0_18px_55px_rgba(28,42,68,0.14)]"
          )}
        >
          <p className="mono-label text-xs text-[color:var(--color-text-accent)]">{copy.badge}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-base sm:leading-8">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
