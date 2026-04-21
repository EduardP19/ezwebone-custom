"use client";

import { useEffect, useState } from "react";
import { readTrackingConsent, updateTrackingConsent } from "@/lib/consent";
import { CookieConsentBanner } from "./CookieConsentBanner";

export function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = readTrackingConsent();
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    updateTrackingConsent("accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    updateTrackingConsent("rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return <CookieConsentBanner onAccept={handleAccept} onReject={handleReject} />;
}
