import type { Locale } from "@/lib/i18n/config";

export const LEGAL_LAST_UPDATED = "5 April 2026";
export const LEGAL_LAST_UPDATED_ISO = "2026-04-05";
export const LEGAL_BUSINESS_NAME = "EZWebOne";
export const LEGAL_COMPANY_STATEMENT =
  "EZWebOne. is a trading name for EMAGF LTD, a company incorporated in England and Wales.";
export const LEGAL_CONTACT_EMAIL = "support@ezwebone.co.uk";

export function getLegalLastUpdated(locale: Locale): string {
  return new Date(LEGAL_LAST_UPDATED_ISO).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
