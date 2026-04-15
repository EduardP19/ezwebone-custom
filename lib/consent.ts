export const TRACKING_CONSENT_KEY = "ezw_tracking_consent";
export const TRACKING_SESSION_KEY = "ezw_session_id";
export const TRACKING_UTM_KEY = "ezw_utm";
export const TRACKING_CONSENT_UPDATED_EVENT = "ezw:tracking-consent-updated";
export const TRACKING_CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type TrackingConsentState = "accepted" | "rejected";

export function isTrackingConsentState(value: string | null): value is TrackingConsentState {
  return value === "accepted" || value === "rejected";
}

export function readTrackingConsent(): TrackingConsentState | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(TRACKING_CONSENT_KEY);
  if (isTrackingConsentState(stored)) {
    return stored;
  }

  const cookieValue =
    document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${TRACKING_CONSENT_KEY}=`))
      ?.split("=")[1] ?? null;

  const decoded = cookieValue ? decodeURIComponent(cookieValue) : null;
  return isTrackingConsentState(decoded) ? decoded : null;
}

export function clearTrackingStorage() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(TRACKING_SESSION_KEY);
  window.sessionStorage.removeItem(TRACKING_UTM_KEY);
}

export function updateTrackingConsent(value: TrackingConsentState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRACKING_CONSENT_KEY, value);
  document.cookie = `${TRACKING_CONSENT_KEY}=${encodeURIComponent(
    value
  )}; Max-Age=${TRACKING_CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;

  if (value === "rejected") {
    clearTrackingStorage();
  }

  window.dispatchEvent(new Event(TRACKING_CONSENT_UPDATED_EVENT));
}
