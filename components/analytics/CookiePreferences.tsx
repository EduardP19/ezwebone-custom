"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import {
  TRACKING_CONSENT_UPDATED_EVENT,
  type TrackingConsentState,
  readTrackingConsent,
  updateTrackingConsent,
} from "@/lib/consent";

export function CookiePreferences() {
  const [consent, setConsent] = useState<TrackingConsentState | null | undefined>(undefined);
  const { dictionary } = useI18n();

  useEffect(() => {
    const syncConsent = () => {
      setConsent(readTrackingConsent());
    };

    syncConsent();
    window.addEventListener(TRACKING_CONSENT_UPDATED_EVENT, syncConsent);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(TRACKING_CONSENT_UPDATED_EVENT, syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  return (
    <div className="rounded-[1.75rem] border border-brand-border bg-brand-warm/70 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-black">
        {dictionary.cookies.preferencesTitle}
      </p>
      <p className="mt-3 text-brand-gray">
        {dictionary.cookies.currentSetting}:{" "}
        <span className="font-semibold text-brand-black">
          {consent === "accepted"
            ? dictionary.cookies.accepted
            : consent === "rejected"
              ? dictionary.cookies.rejected
              : dictionary.cookies.unset}
        </span>
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => updateTrackingConsent("rejected")}>
          {dictionary.cookies.reject}
        </Button>
        <Button type="button" onClick={() => updateTrackingConsent("accepted")}>
          {dictionary.cookies.accept}
        </Button>
      </div>
    </div>
  );
}
