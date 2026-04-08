import { NextResponse } from "next/server";
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
