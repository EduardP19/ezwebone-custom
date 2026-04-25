"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readTrackingConsent, updateTrackingConsent } from "@/lib/consent";
import { CookieConsentBanner } from "./CookieConsentBanner";

export function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isHfRoute = pathname?.startsWith("/hf") || pathname?.startsWith("/ro/hf");
    const delayMs = isHfRoute ? 7000 : 3000;

    const timerId = window.setTimeout(() => {
      const consent = readTrackingConsent();
      setShowBanner(!consent);
    }, delayMs);

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
