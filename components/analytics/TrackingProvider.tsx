"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SESSION_KEY = "ezw_session_id";
const UTM_KEY = "ezw_utm";

type UTMFields = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

type LogPayload = {
  session_id: string;
  lead_id: string | null;
  event_name: string;
  event_type: string;
  occurred_at: string;
  page_url: string | null;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  device_type: string;
  browser: string | null;
  os: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
  language: string | null;
  timezone: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
};

function getOrCreateSessionId(): string {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}

function parseUtmsFromSearch(search: URLSearchParams): UTMFields {
  return {
    utm_source: search.get("utm_source"),
    utm_medium: search.get("utm_medium"),
    utm_campaign: search.get("utm_campaign"),
    utm_term: search.get("utm_term"),
    utm_content: search.get("utm_content"),
  };
}

function readStoredUtms(): UTMFields {
  const fallback: UTMFields = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };
  const raw = window.sessionStorage.getItem(UTM_KEY);
  if (!raw) return fallback;

  try {
    return { ...fallback, ...(JSON.parse(raw) as Partial<UTMFields>) };
  } catch {
    return fallback;
  }
}

function mergeAndStoreUtms(searchParams: URLSearchParams): UTMFields {
  const fromUrl = parseUtmsFromSearch(searchParams);
  const stored = readStoredUtms();

  const merged: UTMFields = {
    utm_source: fromUrl.utm_source ?? stored.utm_source,
    utm_medium: fromUrl.utm_medium ?? stored.utm_medium,
    utm_campaign: fromUrl.utm_campaign ?? stored.utm_campaign,
    utm_term: fromUrl.utm_term ?? stored.utm_term,
    utm_content: fromUrl.utm_content ?? stored.utm_content,
  };

  window.sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
  return merged;
}

function detectDeviceType(): string {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function detectBrowser(userAgent: string): string {
  if (userAgent.includes("Edg/")) return "edge";
  if (userAgent.includes("Chrome/")) return "chrome";
  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) return "safari";
  if (userAgent.includes("Firefox/")) return "firefox";
  return "other";
}

function detectOS(userAgent: string): string {
  if (userAgent.includes("Windows")) return "windows";
  if (userAgent.includes("Mac OS")) return "macos";
  if (userAgent.includes("Android")) return "android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "ios";
  if (userAgent.includes("Linux")) return "linux";
  return "other";
}

function classNameToString(className: unknown): string | null {
  if (typeof className === "string") return className || null;
  if (className && typeof className === "object" && "baseVal" in className) {
    const value = (className as { baseVal?: string }).baseVal;
    return value || null;
  }
  return null;
}

function textFromElement(el: HTMLElement): string | null {
  const attr =
    el.getAttribute("aria-label") ||
    el.getAttribute("data-track-label") ||
    el.getAttribute("title");
  if (attr) return attr.slice(0, 160);
  const text = el.textContent?.replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 160) : null;
}

function sectionFromElement(el: HTMLElement): string {
  if (el.closest("nav")) return "nav";
  if (el.closest("footer")) return "footer";
  if (el.closest("header")) return "header";
  if (el.closest("main")) return "main";
  return "unknown";
}

async function insertLog(payload: LogPayload) {
  if (!supabase) return;

  const { error } = await supabase.from("logs").insert([payload]);
  if (error && process.env.NODE_ENV !== "production") {
    console.warn("Tracking insert failed:", error.message);
  }
}

export function TrackingProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const sessionId = getOrCreateSessionId();
    const utms = mergeAndStoreUtms(searchParams);
    const userAgent = navigator.userAgent;
    const query = searchParams.toString();

    void insertLog({
      session_id: sessionId,
      lead_id: null,
      event_name: "page_view",
      event_type: "page_view",
      occurred_at: new Date().toISOString(),
      page_url: window.location.href,
      page_path: query ? `${pathname}?${query}` : pathname,
      referrer: document.referrer || null,
      ...utms,
      device_type: detectDeviceType(),
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      viewport_width: window.innerWidth || null,
      viewport_height: window.innerHeight || null,
      language: navigator.language || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      user_agent: userAgent,
      metadata: {
        title: document.title || null,
      },
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const clickable = target.closest(
        "a,button,[role='button'],input[type='button'],input[type='submit']"
      ) as HTMLElement | null;
      if (!clickable) return;

      const sessionId = getOrCreateSessionId();
      const utms = readStoredUtms();
      const userAgent = navigator.userAgent;
      const tag = clickable.tagName.toLowerCase();
      const isLink = tag === "a";
      const anchor = isLink ? (clickable as HTMLAnchorElement) : null;

      void insertLog({
        session_id: sessionId,
        lead_id: null,
        event_name: isLink ? "link_click" : "button_click",
        event_type: "click",
        occurred_at: new Date().toISOString(),
        page_url: window.location.href,
        page_path: `${window.location.pathname}${window.location.search}`,
        referrer: document.referrer || null,
        ...utms,
        device_type: detectDeviceType(),
        browser: detectBrowser(userAgent),
        os: detectOS(userAgent),
        viewport_width: window.innerWidth || null,
        viewport_height: window.innerHeight || null,
        language: navigator.language || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        user_agent: userAgent,
        metadata: {
          tag,
          label: textFromElement(clickable),
          id: clickable.id || null,
          class_name: classNameToString(clickable.className),
          href: anchor?.href || null,
          target: anchor?.target || null,
          section: sectionFromElement(clickable),
        },
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
