import { NextResponse } from "next/server";
import { resolveGuideCode, normalizeGuideCode, isValidGuideCode } from "@/lib/guides";

type ResolveBody = {
  code?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ResolveBody;
    const code = normalizeGuideCode(body.code ?? "");

    if (!isValidGuideCode(code)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid unique code." },
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

    return NextResponse.json({
      ok: true,
      code,
      source: resolved.source,
      companyNumber: resolved.row.company_number,
      companyName: resolved.row.company_name,
      fullName: resolved.row.full_name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
