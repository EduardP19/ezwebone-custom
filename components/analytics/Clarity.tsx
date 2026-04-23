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
    if (!projectId || !isAcceptedForClarity) return;

    if (!window.clarity) {
      window.clarity = (...args: unknown[]) => {
        const clarityWithQueue = window.clarity as ((...params: unknown[]) => void) & {
          q?: unknown[][];
        };
        clarityWithQueue.q = clarityWithQueue.q || [];
        clarityWithQueue.q.push(args);
      };
    }

    if (!document.querySelector("script[data-clarity-tag='true']")) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${projectId}`;
      script.setAttribute("data-clarity-tag", "true");
      document.head.appendChild(script);
    }

    window.clarity("consent");
  }, [isAcceptedForClarity, projectId]);

  return null;
}
