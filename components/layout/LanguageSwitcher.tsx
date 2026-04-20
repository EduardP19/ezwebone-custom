"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  locales,
  localizePath,
  stripLocaleFromPathname,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ro: "RO",
};

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, dictionary } = useI18n();

  const basePath = stripLocaleFromPathname(pathname || "/");
  const search = searchParams?.toString();
  const [isSwitching, setIsSwitching] = React.useState(false);

  const handleLocaleChange = React.useCallback(
    (targetLocale: Locale) => {
      if (targetLocale === locale || isSwitching) {
        return;
      }

      const targetPath = `${localizePath(targetLocale, basePath)}${search ? `?${search}` : ""}`;
      setIsSwitching(true);
      window.location.assign(targetPath);
    },
    [basePath, isSwitching, locale, search]
  );

  return (
    <div
      aria-label={dictionary.languageLabel}
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-[#F5F2ED]/5 p-1 backdrop-blur-xl",
        compact ? "gap-0.5" : "gap-1"
      )}
    >
      {locales.map((targetLocale) => {
        const isActive = locale === targetLocale;

        return (
          <button
            key={targetLocale}
            type="button"
            onClick={() => handleLocaleChange(targetLocale)}
            aria-pressed={isActive}
            aria-label={`${dictionary.languageLabel}: ${localeLabels[targetLocale]}`}
            disabled={isSwitching || isActive}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors disabled:cursor-default",
              isActive
                ? "bg-[#F5F2ED] text-[color:var(--color-bg-dark)]"
                : "text-[color:var(--color-text-secondary)] hover:text-white disabled:opacity-70"
            )}
          >
            {localeLabels[targetLocale]}
          </button>
        );
      })}
    </div>
  );
}
