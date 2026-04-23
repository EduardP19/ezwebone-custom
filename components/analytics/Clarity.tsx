"use client";

import { useEffect, useState } from "react";
import {
  TRACKING_CONSENT_UPDATED_EVENT,
  readTrackingConsent,
} from "@/lib/consent";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function Clarity() {
  const [isAcceptedForClarity, setIsAcceptedForClarity] = useState(false);
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";

  useEffect(() => {
    const syncConsent = () => {
      setIsAcceptedForClarity(readTrackingConsent() === "accepted");
    };

    syncConsent();
    window.addEventListener(TRACKING_CONSENT_UPDATED_EVENT, syncConsent);
    return () => window.removeEventListener(TRACKING_CONSENT_UPDATED_EVENT, syncConsent);
  }, []);

  useEffect(() => {
    if (!isAcceptedForClarity) return;
    window.clarity?.("consent");
  }, [isAcceptedForClarity]);

  if (!projectId || !isAcceptedForClarity) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}
