import type { Metadata } from "next";
import { CookiePreferences } from "@/components/analytics/CookiePreferences";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import {
  LEGAL_BUSINESS_NAME,
  LEGAL_LAST_UPDATED,
} from "@/lib/legal";
import { createMetadata } from "@/lib/seo";

const COOKIE_ITEMS = [
  {
    name: "ezw_tracking_consent",
    purpose: "Stores your analytics consent choice so the banner does not keep reappearing.",
    duration: "Persistent until changed or cleared",
    required: "Yes",
  },
  {
    name: "ezw_session_id",
    purpose: "Creates a session identifier for analytics logs after you accept analytics.",
    duration: "Persistent until cleared",
    required: "No",
  },
  {
    name: "ezw_utm",
    purpose: "Stores campaign attribution values such as UTM parameters after you accept analytics.",
    duration: "Session storage",
    required: "No",
  },
];

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "Read the EZWebOne cookie policy and manage analytics consent preferences.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPageShell
      badge="Cookies"
      title={`Cookie Policy for ${LEGAL_BUSINESS_NAME}`}
      updatedOn={LEGAL_LAST_UPDATED}
      intro="This page explains the storage and access technologies currently used on the website, why they are used, and how you can manage your choice."
    >
      <CookiePreferences />

      <LegalSection title="1. What this policy covers">
        <p>
          When we refer to cookies in this policy, we also mean similar technologies
          such as local storage and session storage. This website currently relies on
          those technologies for consent preferences and, where you allow it,
          analytics and campaign attribution.
        </p>
      </LegalSection>

      <LegalSection title="2. How analytics works on this site">
        <p>
          We do not enable analytics until you choose to accept it. If you accept
          analytics, the site may store a session identifier, retain campaign
          attribution values, and record page view and click events to help us
          understand traffic sources and on-site behavior.
        </p>
        <p>
          If you reject analytics, those non-essential tracking features remain off.
        </p>
      </LegalSection>

      <LegalSection title="3. Technologies currently used">
        <div className="space-y-4">
          {COOKIE_ITEMS.map((item) => (
            <div key={item.name} className="rounded-[1.5rem] border border-brand-border bg-white p-5">
              <p className="font-mono text-sm text-brand-black">{item.name}</p>
              <p className="mt-2">{item.purpose}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-brand-gray">
                <span>
                  <strong className="text-brand-black">Duration:</strong> {item.duration}
                </span>
                <span>
                  <strong className="text-brand-black">Strictly necessary:</strong> {item.required}
                </span>
              </div>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="4. Managing your choice">
        <p>
          You can use the controls on this page to accept or reject analytics. You can
          also clear site storage in your browser settings if you want to remove
          previously stored preferences or analytics identifiers.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
