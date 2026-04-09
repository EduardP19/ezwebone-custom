import { NextResponse } from "next/server";
import { sendTestLetterPreviewByCompany, type SendSource } from "@/lib/stannpAPI";

type PreviewPayload = {
  companyNumber?: unknown;
  source?: unknown;
  templateId?: unknown;
  test?: unknown;
};

function asRequiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asOptionalBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  }
  return null;
}

export async function POST(request: Request) {
  let body: PreviewPayload = {};
  try {
    body = (await request.json()) as PreviewPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const companyNumber = asRequiredString(body.companyNumber);
  const source: SendSource = body.source === "ro" ? "ro" : "non_ro";
  const templateId = asOptionalNumber(body.templateId);
  const test = asOptionalBoolean(body.test);

  if (!companyNumber) {
    return NextResponse.json({ error: "companyNumber is required." }, { status: 400 });
  }

  try {
    const result = await sendTestLetterPreviewByCompany({
      companyNumber,
      source,
      templateId: templateId ?? undefined,
      test: test ?? true,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview send failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
