"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  TRACKING_SESSION_KEY,
  TRACKING_UTM_KEY,
} from "@/lib/consent";
import { supabase } from "@/lib/supabase";

type UTMFields = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

type LogPayload = {
  session_id: string;
  source_site: "ezwebone";
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
  const existing = window.sessionStorage.getItem(TRACKING_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(TRACKING_SESSION_KEY, id);
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
  const raw = window.sessionStorage.getItem(TRACKING_UTM_KEY);
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

  window.sessionStorage.setItem(TRACKING_UTM_KEY, JSON.stringify(merged));
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
    el.getAttribute("data-track-label") ||
    el.getAttribute("aria-label") ||
    el.getAttribute("title");
  if (attr) return attr.slice(0, 220);
  const text = el.textContent?.replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 220) : null;
}

function sectionFromElement(el: HTMLElement): string {
  if (el.closest("[role='dialog']")) return "dialog";
  if (el.closest("nav")) return "nav";
  if (el.closest("footer")) return "footer";
  if (el.closest("header")) return "header";
  if (el.closest("main")) return "main";
  return "unknown";
}

function toEventToken(value: string): string {
  const tokens = value
    .replace(/stampuser:/gi, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1));

  if (tokens.length === 0) return "Unknown";
  return tokens.join("_").slice(0, 120);
}

function resolveClickEventType(clickTarget: HTMLElement): string {
  const dataTrackLabel = clickTarget.getAttribute("data-track-label")?.trim() ?? "";
  const ariaLabel = clickTarget.getAttribute("aria-label")?.trim() ?? "";
  const textLabel = textFromElement(clickTarget) ?? "";

  if (dataTrackLabel.includes("theme-toggle")) {
    const targetTheme = ariaLabel.toLowerCase().includes("dark")
      ? "DarkTheme"
      : ariaLabel.toLowerCase().includes("light")
        ? "LightTheme"
        : "UnknownTheme";
    const surface = dataTrackLabel.includes(":desktop")
      ? "Desktop"
      : dataTrackLabel.includes(":mobile")
        ? "Mobile"
        : "UnknownSurface";
    return `ThemeToggle_${surface}_${targetTheme}`;
  }

  if (dataTrackLabel.includes("chat-window-send")) {
    return "ChatWindow_Send";
  }

  if (dataTrackLabel.includes("chat-window-open-fab")) {
    return "ChatWindow_Open";
  }

  if (dataTrackLabel.includes("chat-window-book-call")) {
    return "ChatWindow_BookCall";
  }

  if (dataTrackLabel) {
    return `Click_${toEventToken(dataTrackLabel)}`;
  }

  if (ariaLabel) {
    return `Click_${toEventToken(ariaLabel)}`;
  }

  if (textLabel) {
    return `Click_${toEventToken(textLabel)}`;
  }

  if (clickTarget.id) {
    return `Click_${toEventToken(clickTarget.id)}`;
  }

  return "Click_Unknown";
}

function getPagePath(pathname: string, searchParams: URLSearchParams): string {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

async function insertLog(payload: LogPayload) {
  if (!supabase) {
    console.error("Tracking insert skipped: Supabase client is not configured.");
    return;
  }

  const { error } = await supabase.from("logs").insert([payload]);

  if (error) {
    console.error("Tracking insert failed:", {
      message: error.message,
      code: error.code ?? null,
      details: error.details ?? null,
      hint: error.hint ?? null,
      event_type: payload.event_type,
      page_path: payload.page_path,
      source_site: payload.source_site,
    });
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

    void insertLog({
      session_id: sessionId,
      source_site: "ezwebone",
      lead_id: null,
      event_name: "page_view",
      event_type: "page_view",
      occurred_at: new Date().toISOString(),
      page_url: window.location.href,
      page_path: getPagePath(pathname, searchParams),
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
        site: "ezwebone",
        title: document.title || null,
      },
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest(
        "a,button,[role='button'],input[type='button'],input[type='submit']"
      ) as HTMLElement | null;
      const clickTarget = clickable ?? target;
      const sessionId = getOrCreateSessionId();
      const userAgent = navigator.userAgent;
      const utms = readStoredUtms();
      const tag = clickTarget.tagName.toLowerCase();
      const isLink = tag === "a";
      const anchor = isLink ? (clickTarget as HTMLAnchorElement) : null;
      const isDialogClick = Boolean(clickTarget.closest("[role='dialog']"));
      const isBackdropClick = Boolean(
        clickTarget.getAttribute("data-track-label")?.includes("backdrop")
      );
      const resolvedEventType = resolveClickEventType(clickTarget);

      void insertLog({
        session_id: sessionId,
        source_site: "ezwebone",
        lead_id: null,
        event_name: "click_any",
        event_type: resolvedEventType,
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
          site: "ezwebone",
          tag,
          label: textFromElement(clickTarget),
          id: clickTarget.id || null,
          class_name: classNameToString(clickTarget.className),
          href: anchor?.href || null,
          target: anchor?.target || null,
          section: sectionFromElement(clickTarget),
          is_clickable: Boolean(clickable),
          is_dialog_click: isDialogClick,
          is_dialog_backdrop_click: isBackdropClick,
          x: event.clientX,
          y: event.clientY,
        },
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
