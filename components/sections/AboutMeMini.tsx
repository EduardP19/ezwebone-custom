"use client";

import * as React from "react";
import Image from "next/image";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { useIsDark } from "@/lib/useTheme";
import { cn } from "@/lib/utils";

const FOUNDER_PHOTO_SRC = "/founder/eduard.jpg";

export function AboutMeMini() {
  const { dictionary } = useI18n();
  const copy = dictionary.home.aboutMe;
  const isDark = useIsDark();
  const [photoFailed, setPhotoFailed] = React.useState(false);

  return (
    <section
      className={cn(
        "section-shell section-shift section-shift-neutral py-16 sm:py-20",
        isDark
          ? "bg-[color:var(--color-bg-dark)]"
          : "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className={cn(
            "mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl px-5 py-8 text-center backdrop-blur-xl sm:flex-row sm:gap-8 sm:px-8 sm:py-9 sm:text-left",
            isDark
              ? "border border-white/10 bg-[rgba(17,17,24,0.72)]"
              : "border border-[color:var(--color-border)]/70 bg-[rgba(255,255,255,0.88)] shadow-[0_18px_55px_rgba(28,42,68,0.14)]"
          )}
        >
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[color:var(--color-primary)]/40 sm:h-32 sm:w-32">
            {photoFailed ? (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,var(--color-primary),var(--color-accent))] text-4xl font-semibold text-white">
                {copy.initial}
              </div>
            ) : (
              <Image
                src={FOUNDER_PHOTO_SRC}
                alt={copy.name}
                fill
                sizes="128px"
                className="object-cover"
                onError={() => setPhotoFailed(true)}
              />
            )}
          </div>

          <div>
            <p className="mono-label text-xs text-[color:var(--color-text-accent)]">{copy.badge}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--color-text-primary)] sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-base sm:leading-8">
              {copy.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
