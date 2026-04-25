import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { formatPersonName, newLead } from "@/lib/leadProcessing";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

type GuideRequestBody = {
  fullName?: unknown;
  email?: unknown;
  industry?: unknown;
  message?: unknown;
  locale?: unknown;
  landingUrl?: unknown;
  trackingParams?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEMPLATE_PATHS = {
  en: path.join(process.cwd(), "emails", "beauty_init.html"),
  ro: path.join(process.cwd(), "emails", "ro_beauty_init.html"),
} as const;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLocale(value: unknown): "en" | "ro" {
  return value === "ro" ? "ro" : "en";
}

function normalizeTrackingParams(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => typeof key === "string" && typeof item === "string")
      .map(([key, item]) => [key, item.trim()])
  );
}

function readTrackingParam(params: Record<string, string>, key: string) {
  return (params[key] ?? params[key.toUpperCase()] ?? params[key.toLowerCase()] ?? "").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getFirstName(fullName: string, email: string) {
  const formatted = formatPersonName(fullName);
  if (formatted.first_name) {
    return formatted.first_name;
  }

  const localPart = email.split("@")[0] ?? "";
  const fallback = localPart.split(/[._-]+/).find(Boolean) ?? "there";
  return fallback.charAt(0).toUpperCase() + fallback.slice(1).toLowerCase();
}

function getGuideUrl() {
  return (
    process.env.BT_GUIDE_URL ??
    process.env.GUIDES_DOWNLOAD_URL ??
    process.env.GUIDE_DOWNLOAD_URL ??
    "https://www.ezwebone.co.uk/guides?sent=1"
  );
}

async function renderGuideEmailHtml(locale: "en" | "ro", firstName: string, guideUrl: string) {
  const template = await readFile(TEMPLATE_PATHS[locale], "utf8");
  return template
    .replaceAll("{{firstName}}", escapeHtml(firstName))
    .replaceAll("{{guideUrl}}", escapeHtml(guideUrl));
}

async function sendGuideEmail(locale: "en" | "ro", email: string, firstName: string, guideUrl: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_123456789") {
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = await renderGuideEmailHtml(locale, firstName, guideUrl);
  const subject = locale === "ro" ? "Ghidul tau este aici" : "Your free guide is ready";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "EZWebOne <hello@ezwebone.co.uk>",
    to: email,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as GuideRequestBody;
    const fullName = asString(body.fullName);
    const email = asString(body.email).toLowerCase();
    const industry = asString(body.industry);
    const message = asString(body.message);
    const locale = normalizeLocale(body.locale);
    const landingUrl = asString(body.landingUrl);
    const trackingParams = normalizeTrackingParams(body.trackingParams);

    if (fullName.length < 2) {
      return NextResponse.json({ ok: false, error: "Please enter your full name." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }

    if (!industry) {
      return NextResponse.json({ ok: false, error: "Please enter your industry." }, { status: 400 });
    }

    const db = supabaseAdmin ?? supabase;
    if (!db) {
      return NextResponse.json({ ok: false, error: "Supabase is not configured." }, { status: 500 });
    }

    const sourcePage = landingUrl || (locale === "ro" ? "/ro/bt" : "/bt");
    const source = readTrackingParam(trackingParams, "utm_source") || "bt_guide_form";
    const campaign =
      readTrackingParam(trackingParams, "utm_campaign") ||
      readTrackingParam(trackingParams, "UTM_CAMPAIGN") ||
      "bt_guide";
    const medium = readTrackingParam(trackingParams, "utm_medium") || "landing_page";
    const formattedMessage = `Industry: ${industry}${message ? `\n\n${message}` : ""}`;

    const leadResult = await newLead({
      name: fullName,
      email,
      companyName: industry,
      message: formattedMessage,
      sourcePage,
      source,
      campaign,
      medium,
      userAgent: req.headers.get("user-agent"),
      niche: industry,
      metadata: {
        form_kind: "bt_guide_request",
        requested_guide: "online_presence_self_improvement",
        industry,
        landing_url: landingUrl || null,
        tracking_params: trackingParams,
      },
    });

    const { error: formError } = await db.from("forms").insert([
      {
        full_name: fullName,
        email,
        business_name: industry,
        message: formattedMessage,
        source: locale === "ro" ? "Beauty Guide Request RO" : "Beauty Guide Request",
      },
    ]);

    if (formError) {
      throw new Error(`Failed to store form submission: ${formError.message}`);
    }

    const guideUrl = getGuideUrl();
    const firstName = getFirstName(fullName, email);
    const emailSent = await sendGuideEmail(locale, email, firstName, guideUrl);

    return NextResponse.json({
      ok: true,
      emailSent,
      guideUrl,
      leadId: leadResult.lead?.lead_id ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
