import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resolveGuideCode, normalizeGuideCode, isValidGuideCode } from "@/lib/guides";

type ClaimBody = {
  code?: string;
  firstName?: string;
  email?: string;
  landingUrl?: string;
  trackingParams?: Record<string, string>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GUIDE_EMAIL_TEMPLATE_PATH = path.join(process.cwd(), "emails", "ro_beauty_init.html");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function renderGuideEmailHtml(firstName: string, guideUrl: string): Promise<string> {
  const template = await readFile(GUIDE_EMAIL_TEMPLATE_PATH, "utf8");
  return template
    .replaceAll("{{firstName}}", escapeHtml(firstName))
    .replaceAll("{{guideUrl}}", escapeHtml(guideUrl));
}

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { ok: false, error: "Supabase admin client is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as ClaimBody;
    const code = normalizeGuideCode(body.code ?? "");
    const firstName = (body.firstName ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const landingUrl = (body.landingUrl ?? "").trim();
    const trackingParams = Object.fromEntries(
      Object.entries(
        body.trackingParams && typeof body.trackingParams === "object" ? body.trackingParams : {}
      )
        .filter(([key, value]) => typeof key === "string" && typeof value === "string")
        .map(([key, value]) => [key, value.trim()])
    );

    if (!isValidGuideCode(code)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid unique code." },
        { status: 400 }
      );
    }

    if (!firstName || firstName.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please enter your first name." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const resolved = await resolveGuideCode(code);
    if (!resolved) {
      return NextResponse.json(
        { ok: false, error: "Code not found. Please check and try again." },
        { status: 404 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("guide_leads")
      .insert({
        code,
        first_name: firstName,
        email,
        source: resolved.source,
        source_table: resolved.sourceTable,
        source_row_id: resolved.row.id,
        company_number: resolved.row.company_number,
        company_name: resolved.row.company_name,
        director_full_name: resolved.row.full_name,
        landing_url: landingUrl || null,
        qr_params: trackingParams,
      });

    if (insertError) {
      throw new Error(`Failed to save lead capture: ${insertError.message}`);
    }

    const { error: statusError } = await supabaseAdmin
      .from(resolved.sourceTable)
      .update({ campaign_status: "lead_captured" })
      .eq("id", resolved.row.id);

    if (statusError) {
      throw new Error(`Failed to update campaign status: ${statusError.message}`);
    }

    const guideUrl =
      process.env.GUIDES_DOWNLOAD_URL ??
      process.env.GUIDE_DOWNLOAD_URL ??
      "https://www.ezwebone.co.uk/guides?sent=1";

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_123456789") {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = await renderGuideEmailHtml(firstName, guideUrl);

      const { data, error: sendError } = await resend.emails.send({
        from: process.env.RESEND_FROM ?? "EzwebOne <hello@ezwebone.co.uk>",
        to: email,
        subject: "Ghidul tau este aici 🎉",
        html,
      });

      if (sendError) {
        throw new Error(`Resend send failed: ${sendError.message}`);
      }

      if (process.env.NODE_ENV !== "production") {
        console.info("Guide email sent via Resend", {
          to: email,
          emailId: data?.id ?? null,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      guideUrl,
      firstName,
      companyName: resolved.row.company_name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
