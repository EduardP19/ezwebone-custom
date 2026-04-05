"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface CookieConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

export function CookieConsentBanner({
  onAccept,
  onReject,
}: CookieConsentBannerProps) {
  return (
    <div className="fixed inset-x-0 bottom-4 z-[120] px-4 md:px-6">
      <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-[rgba(10,10,15,0.96)] p-5 text-white shadow-[0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mono-label text-xs text-[color:var(--color-text-accent)]">Privacy choices</p>
            <h2 className="mt-2 text-xl font-display font-semibold text-white md:text-2xl">
              We only enable analytics after you say yes.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">
              EZWebOne uses local storage and similar technologies to measure page views,
              traffic sources, and on-site interactions. You can accept or reject
              non-essential tracking. Read the{" "}
              <Link href="/cookies" className="text-white underline underline-offset-4">
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={onReject}>
              Reject analytics
            </Button>
            <Button type="button" onClick={onAccept}>
              Accept analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
