"use client";

import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";

interface CookieConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

export function CookieConsentBanner({
  onAccept,
  onReject,
}: CookieConsentBannerProps) {
  const { dictionary } = useI18n();

  return (
    <div className="fixed inset-x-0 bottom-4 z-[120] px-4 md:px-6">
      <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-[rgba(10,10,15,0.96)] p-5 text-white shadow-[0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mono-label text-xs text-[color:var(--color-text-accent)]">
              {dictionary.cookies.bannerLabel}
            </p>
            <h2 className="mt-2 text-xl font-display font-semibold text-white md:text-2xl">
              {dictionary.cookies.bannerTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">
              {dictionary.cookies.bannerBody}{" "}
              <LocalizedLink href="/cookies" className="text-white underline underline-offset-4">
                {dictionary.footer.quickLinks.cookies}
              </LocalizedLink>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={onReject}>
              {dictionary.cookies.reject}
            </Button>
            <Button type="button" onClick={onAccept}>
              {dictionary.cookies.accept}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
