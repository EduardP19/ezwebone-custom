import { NextResponse } from "next/server";
import { sendDueLetters } from "@/lib/stannpAPI";

type SendAllPayload = {
  source?: unknown;
  templateId?: unknown;
  test?: unknown;
};

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
    if (["1", "true", "yes"].includes(normalized)) return true;
    if (["0", "false", "no"].includes(normalized)) return false;
  }
  return null;
}

export async function POST(request: Request) {
  let body: SendAllPayload = {};
  try {
    body = (await request.json()) as SendAllPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const source = body.source === "ro" ? "ro" : "non_ro";
  const templateId = asOptionalNumber(body.templateId);
  const test = asOptionalBoolean(body.test) ?? false;

  const statuses = ["to_send", "to send"];

  try {
    let queuedTotal = 0;
    let sentTotal = 0;
    let failedTotal = 0;
    const errors: Array<{ rowId: string; error: string }> = [];

    while (true) {
      const result = await sendDueLetters({
        test,
        limit: 100,
        source,
        templateId: templateId ?? undefined,
        statuses,
      });

      queuedTotal += result.queued;
      sentTotal += result.sent;
      failedTotal += result.failed;
      errors.push(...result.errors);

      if (result.queued < 100) {
        break;
      }
    }

    return NextResponse.json({
      ok: true,
      source,
      test,
      templateId: templateId ?? null,
      statuses,
      queued: queuedTotal,
      sent: sentTotal,
      failed: failedTotal,
      errors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send all due letters.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
