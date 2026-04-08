import { NextResponse } from "next/server";
import { sendDueLetters } from "@/lib/stannpAPI";

function isAuthorized(request: Request) {
  const expectedSecret = process.env.STANNP_CRON_SECRET;
  if (!expectedSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }

  const provided = authHeader.slice("Bearer ".length).trim();
  return provided.length > 0 && provided === expectedSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const test = typeof body.test === "boolean" ? body.test : true;
  const limitRaw = typeof body.limit === "number" ? body.limit : Number(body.limit);
  const limit = Number.isFinite(limitRaw) ? limitRaw : 25;
  const source = body.source === "ro" ? "ro" : "non_ro";
  const templateIdRaw =
    typeof body.templateId === "number" ? body.templateId : Number(body.templateId);
  const templateId = Number.isFinite(templateIdRaw) ? templateIdRaw : undefined;

  try {
    const result = await sendDueLetters({ test, limit, source, templateId });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send due letters.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
