"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readTrackingConsent, updateTrackingConsent } from "@/lib/consent";
import { CookieConsentBanner } from "./CookieConsentBanner";

export function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const consent = readTrackingConsent();
      setShowBanner(!consent);
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [pathname]);

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
