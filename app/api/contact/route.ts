import { NextResponse } from "next/server";
import { newLead } from "@/lib/leadProcessing";

function asRequiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown) {
  const nextValue = asRequiredString(value);
  return nextValue.length > 0 ? nextValue : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const firstName = asRequiredString(body.firstName);
    const lastName = asOptionalString(body.lastName);
    const email = asRequiredString(body.email).toLowerCase();
    const phone = asOptionalString(body.phone);
    const businessName = asOptionalString(body.businessName);
    const serviceInterest = asOptionalString(body.serviceInterest);
    const message = asOptionalString(body.message);
    const sourcePage = asOptionalString(body.sourcePage) ?? "Direct Contact";

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "First name and email are required." },
        { status: 400 }
      );
    }

    const result = await newLead({
      name: `${firstName} ${lastName ?? ""}`.trim(),
      firstName,
      lastName,
      email,
      phone,
      companyName: businessName,
      message,
      sourcePage,
      source: asOptionalString(body.source),
      campaign: asOptionalString(body.campaign),
      medium: asOptionalString(body.medium),
      sessionId: asOptionalString(body.sessionId),
      country: asOptionalString(body.country),
      userAgent: req.headers.get("user-agent"),
      niche: asOptionalString(body.niche),
      companyNumber: asOptionalString(body.companyNumber),
      discount: asOptionalString(body.discount),
      metadata: {
        service_interest: serviceInterest,
      },
    });

    return NextResponse.json({ success: true, leadStatus: result.status });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
