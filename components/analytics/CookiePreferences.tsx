"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  TRACKING_CONSENT_UPDATED_EVENT,
  type TrackingConsentState,
  readTrackingConsent,
  updateTrackingConsent,
} from "@/lib/consent";

function labelForConsent(value: TrackingConsentState | null | undefined) {
  if (value === "accepted") return "Analytics accepted";
  if (value === "rejected") return "Analytics rejected";
  return "No choice saved yet";
}

export function CookiePreferences() {
  const [consent, setConsent] = useState<TrackingConsentState | null | undefined>(undefined);

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
        Cookie preferences
      </p>
      <p className="mt-3 text-brand-gray">
        Current setting: <span className="font-semibold text-brand-black">{labelForConsent(consent)}</span>
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => updateTrackingConsent("rejected")}>
          Reject analytics
        </Button>
        <Button type="button" onClick={() => updateTrackingConsent("accepted")}>
          Accept analytics
        </Button>
      </div>
    </div>
  );
}
