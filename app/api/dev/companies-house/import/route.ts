import { NextResponse } from "next/server";
import { runCompaniesHouseImport } from "@/lib/companiesHouseImport";

type ImportPayload = {
  incorporatedFrom?: unknown;
  incorporatedTo?: unknown;
  sicCode?: unknown;
  size?: unknown;
  maxCompanies?: unknown;
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

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  let payload: ImportPayload = {};

  try {
    payload = (await request.json()) as ImportPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const incorporatedFrom = asRequiredString(payload.incorporatedFrom);
  const incorporatedTo = asRequiredString(payload.incorporatedTo);
  const sicCode = asRequiredString(payload.sicCode);
  const size = asRequiredString(payload.size);
  const maxCompanies = asOptionalNumber(payload.maxCompanies) ?? 2000;

  if (!incorporatedFrom || !incorporatedTo || !sicCode || !size) {
    return NextResponse.json(
      {
        error: "incorporatedFrom, incorporatedTo, sicCode, and size are required.",
      },
      { status: 400 }
    );
  }

  if (!isIsoDate(incorporatedFrom) || !isIsoDate(incorporatedTo)) {
    return NextResponse.json(
      { error: "incorporatedFrom and incorporatedTo must use YYYY-MM-DD format." },
      { status: 400 }
    );
  }

  try {
    const result = await runCompaniesHouseImport({
      incorporatedFrom,
      incorporatedTo,
      sicCode,
      size,
      maxCompanies,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
