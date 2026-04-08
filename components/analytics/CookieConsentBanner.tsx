"use client";

import * as React from "react";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useIsDark } from "@/lib/useTheme";

interface CookieConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

export function CookieConsentBanner({
  onAccept,
  onReject,
}: CookieConsentBannerProps) {
  const { dictionary } = useI18n();
  const isDark = useIsDark();

  return (
    <div className="fixed inset-x-0 bottom-3 z-[120] px-3 sm:bottom-4 sm:px-4 md:px-6">
      <div className={cn(
        "mx-auto max-w-4xl rounded-2xl border p-4 shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:p-5",
        isDark
          ? "border-white/10 bg-[rgba(10,10,15,0.96)] text-white backdrop-blur-xl"
          : "border-[color:var(--color-border)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)]"
      )}>
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mono-label text-[10px] text-[color:var(--color-text-accent)] sm:text-xs">
              {dictionary.cookies.bannerLabel}
            </p>
            <h2 className={cn("mt-1.5 text-lg font-display font-semibold sm:text-xl", isDark ? "text-white" : "text-[color:var(--color-text-primary)]")}>
              {dictionary.cookies.bannerTitle}
            </h2>
            <p className={cn("mt-2 text-xs leading-6 sm:text-sm sm:leading-7", isDark ? "text-white/70" : "text-[color:var(--color-text-secondary)]")}>
              {dictionary.cookies.bannerBody}{" "}
              <LocalizedLink
                href="/cookies"
                className={cn("underline underline-offset-4", isDark ? "text-white" : "text-[color:var(--color-primary)]")}
              >
                {dictionary.footer.quickLinks.cookies}
              </LocalizedLink>
              .
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button type="button" variant="secondary" onClick={onReject} className="min-h-11">
              {dictionary.cookies.reject}
            </Button>
            <Button type="button" onClick={onAccept} className="min-h-11">
              {dictionary.cookies.accept}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
