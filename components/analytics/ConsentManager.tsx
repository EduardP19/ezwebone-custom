"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readTrackingConsent, updateTrackingConsent } from "@/lib/consent";
import { CookieConsentBanner } from "./CookieConsentBanner";

export function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const maybeShowBanner = () => {
      const consent = readTrackingConsent();
      setShowBanner(!consent);
    };

    const isHfRoute = pathname === "/hf" || pathname.endsWith("/hf");
    if (!isHfRoute) {
      maybeShowBanner();
      return;
    }

    if (window.sessionStorage.getItem("hf_loaded")) {
      maybeShowBanner();
      return;
    }

    const intervalId = window.setInterval(() => {
      if (!window.sessionStorage.getItem("hf_loaded")) return;
      window.clearInterval(intervalId);
      maybeShowBanner();
    }, 250);

    return () => window.clearInterval(intervalId);
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
