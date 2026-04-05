export const TRACKING_CONSENT_KEY = "ezw_tracking_consent";
export const TRACKING_SESSION_KEY = "ezw_session_id";
export const TRACKING_UTM_KEY = "ezw_utm";
export const TRACKING_CONSENT_UPDATED_EVENT = "ezw:tracking-consent-updated";

export type TrackingConsentState = "accepted" | "rejected";

export function isTrackingConsentState(value: string | null): value is TrackingConsentState {
  return value === "accepted" || value === "rejected";
}

export function readTrackingConsent(): TrackingConsentState | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(TRACKING_CONSENT_KEY);
  return isTrackingConsentState(value) ? value : null;
}

export function clearTrackingStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TRACKING_SESSION_KEY);
  window.sessionStorage.removeItem(TRACKING_UTM_KEY);
}

export function updateTrackingConsent(value: TrackingConsentState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRACKING_CONSENT_KEY, value);

  if (value === "rejected") {
    clearTrackingStorage();
  }

  window.dispatchEvent(new Event(TRACKING_CONSENT_UPDATED_EVENT));
}
