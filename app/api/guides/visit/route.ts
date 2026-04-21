import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type VisitBody = {
  companyNumber?: string;
  source?: "ro" | "non_ro" | null;
};

function normalizeCompanyNumber(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

function normalizeSource(input: string | null | undefined): "ro" | "non_ro" | null {
  if (!input) return null;
  const value = input.trim().toLowerCase();
  if (value === "ro" || value === "romanian" || value === "romania" || value === "true" || value === "1") {
    return "ro";
  }
  if (value === "non_ro" || value === "non-ro" || value === "other" || value === "false" || value === "0") {
    return "non_ro";
  }
  return null;
}

async function markVisited(table: "ch_directors_non_ro" | "ch_directors_ro", companyNumber: string) {
  const { error } = await supabaseAdmin!
    .from(table)
    .update({ campaign_status: "QR scanned" })
    .eq("company_number", companyNumber)
    .in("campaign_status", ["letter sent", "letter_sent"]);

  if (error) {
    throw new Error(`Failed updating ${table}: ${error.message}`);
  }
}

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { ok: false, error: "Supabase admin client is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as VisitBody;
    const companyNumber = normalizeCompanyNumber(body.companyNumber ?? "");
    const source = normalizeSource(body.source);

    if (!companyNumber) {
      return NextResponse.json(
        { ok: false, error: "companyNumber is required." },
        { status: 400 }
      );
    }

    if (source === "ro") {
      await markVisited("ch_directors_ro", companyNumber);
      return NextResponse.json({ ok: true, companyNumber, source: "ro" });
    }

    if (source === "non_ro") {
      await markVisited("ch_directors_non_ro", companyNumber);
      return NextResponse.json({ ok: true, companyNumber, source: "non_ro" });
    }

    await markVisited("ch_directors_non_ro", companyNumber);
    await markVisited("ch_directors_ro", companyNumber);

    return NextResponse.json({ ok: true, companyNumber, source: "auto" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
