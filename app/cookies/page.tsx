import type { Metadata } from "next";
import { CookiePreferences } from "@/components/analytics/CookiePreferences";
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request";
import {
  LEGAL_BUSINESS_NAME,
  getLegalLastUpdated,
} from "@/lib/legal";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale).metadata.legal;

  return createMetadata({
    title: copy.cookiesTitle,
    description: copy.cookiesDescription,
    path: "/cookies",
    locale,
  });
}

export default async function CookiesPage() {
  const locale = await getRequestLocale();
  const updatedOn = getLegalLastUpdated(locale);
  const isRo = locale === "ro";
  const cookieItems = isRo
    ? [
        {
          name: "ezw_tracking_consent",
          purpose:
            "Stocheaza alegerea ta pentru analytics, astfel incat bannerul sa nu reapara constant.",
          duration: "Persistent pana la schimbare sau stergere",
          required: "Da",
        },
        {
          name: "ezw_session_id",
          purpose:
            "Creeaza un identificator de sesiune pentru logurile de analytics dupa ce accepti analytics.",
          duration: "Persistent pana la stergere",
          required: "Nu",
        },
        {
          name: "ezw_utm",
          purpose:
            "Stocheaza valorile de atribuire a campaniilor, precum parametrii UTM, dupa ce accepti analytics.",
          duration: "Session storage",
          required: "Nu",
        },
      ]
    : [
        {
          name: "ezw_tracking_consent",
          purpose:
            "Stores your analytics consent choice so the banner does not keep reappearing.",
          duration: "Persistent until changed or cleared",
          required: "Yes",
        },
        {
          name: "ezw_session_id",
          purpose:
            "Creates a session identifier for analytics logs after you accept analytics.",
          duration: "Persistent until cleared",
          required: "No",
        },
        {
          name: "ezw_utm",
          purpose:
            "Stores campaign attribution values such as UTM parameters after you accept analytics.",
          duration: "Session storage",
          required: "No",
        },
      ];

  return (
    <LegalPageShell
      badge={isRo ? "Cookie-uri" : "Cookies"}
      title={
        isRo
          ? `Politica de cookie-uri pentru ${LEGAL_BUSINESS_NAME}`
          : `Cookie Policy for ${LEGAL_BUSINESS_NAME}`
      }
      updatedOn={updatedOn}
      updatedLabel={isRo ? "Ultima actualizare" : "Last updated"}
      intro={
        isRo
          ? "Aceasta pagina explica tehnologiile de stocare si acces folosite in prezent pe website, de ce sunt folosite si cum iti poti gestiona alegerea."
          : "This page explains the storage and access technologies currently used on the website, why they are used, and how you can manage your choice."
      }
    >
      <CookiePreferences />

      <LegalSection title={isRo ? "1. Ce acopera aceasta politica" : "1. What this policy covers"}>
        <p>
          {isRo
            ? "Cand ne referim la cookies in aceasta politica, includem si tehnologii similare precum local storage si session storage. Website-ul foloseste in prezent aceste tehnologii pentru preferintele de consimtamant si, acolo unde permiti, pentru analytics si atribuirea campaniilor."
            : "When we refer to cookies in this policy, we also mean similar technologies such as local storage and session storage. This website currently relies on those technologies for consent preferences and, where you allow it, analytics and campaign attribution."}
        </p>
      </LegalSection>

      <LegalSection
        title={isRo ? "2. Cum functioneaza analytics pe acest site" : "2. How analytics works on this site"}
      >
        <p>
          {isRo
            ? "Nu activam analytics pana nu alegi sa il accepti. Daca accepti analytics, site-ul poate stoca un identificator de sesiune, poate retine valori de atribuire a campaniilor si poate inregistra page view-uri si click-uri pentru a intelege sursele de trafic si comportamentul din site."
            : "We do not enable analytics until you choose to accept it. If you accept analytics, the site may store a session identifier, retain campaign attribution values, and record page view and click events to help us understand traffic sources and on-site behavior."}
        </p>
        <p>
          {isRo
            ? "Daca respingi analytics, acele functii de tracking neesential raman oprite."
            : "If you reject analytics, those non-essential tracking features remain off."}
        </p>
      </LegalSection>

      <LegalSection title={isRo ? "3. Tehnologii folosite in prezent" : "3. Technologies currently used"}>
        <div className="space-y-4">
          {cookieItems.map((item) => (
            <div key={item.name} className="rounded-[1.5rem] border border-brand-border bg-white p-5">
              <p className="font-mono text-sm text-brand-black">{item.name}</p>
              <p className="mt-2">{item.purpose}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-brand-gray">
                <span>
                  <strong className="text-brand-black">{isRo ? "Durata:" : "Duration:"}</strong>{" "}
                  {item.duration}
                </span>
                <span>
                  <strong className="text-brand-black">
                    {isRo ? "Strict necesar:" : "Strictly necessary:"}
                  </strong>{" "}
                  {item.required}
                </span>
              </div>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title={isRo ? "4. Cum iti gestionezi alegerea" : "4. Managing your choice"}>
        <p>
          {isRo
            ? "Poti folosi controalele de pe aceasta pagina pentru a accepta sau respinge analytics. De asemenea, poti sterge stocarea site-ului din setarile browserului daca vrei sa elimini preferintele sau identificatorii analytics salvati anterior."
            : "You can use the controls on this page to accept or reject analytics. You can also clear site storage in your browser settings if you want to remove previously stored preferences or analytics identifiers."}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
