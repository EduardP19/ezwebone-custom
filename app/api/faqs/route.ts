import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Locale } from "@/lib/i18n/config";

type Audience = "ezwebone" | "beauty";

function isAudience(value: string | null): value is Audience {
  return value === "ezwebone" || value === "beauty";
}

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "ro";
}

export async function GET(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: "Supabase admin client is not configured." }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const audience = isAudience(searchParams.get("audience")) ? searchParams.get("audience") : "ezwebone";
    const locale = isLocale(searchParams.get("locale")) ? searchParams.get("locale") : "en";

    const { data, error } = await supabaseAdmin
      .from("faqs")
      .select("id, question_en, answer_en, question_ro, answer_ro, sort_order")
      .eq("audience", audience)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to load FAQs: ${error.message}`);
    }

    const items = (data ?? []).map((row) => ({
      id: row.id,
      question: locale === "ro" ? row.question_ro : row.question_en,
      answer: locale === "ro" ? row.answer_ro : row.answer_en,
    }));

    return NextResponse.json({
      ok: true,
      audience,
      locale,
      items,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
