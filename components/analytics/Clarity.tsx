"use client";

import { useEffect, useState } from "react";
import { readTrackingConsent, TRACKING_CONSENT_UPDATED_EVENT } from "@/lib/consent";

export function Clarity() {
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    // Initial check
    setConsent(readTrackingConsent());

    // Listen for updates from the banner
    const handleConsentUpdate = () => {
      setConsent(readTrackingConsent());
    };

    window.addEventListener(TRACKING_CONSENT_UPDATED_EVENT, handleConsentUpdate);
    return () => window.removeEventListener(TRACKING_CONSENT_UPDATED_EVENT, handleConsentUpdate);
  }, []);

  if (consent !== "accepted") return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
        `,
      }}
    />
  );
}
