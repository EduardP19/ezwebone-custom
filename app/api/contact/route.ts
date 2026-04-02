import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function asRequiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown) {
  const nextValue = asRequiredString(value);
  return nextValue.length > 0 ? nextValue : null;
}

export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Lead capture is not configured on this deployment." },
        { status: 503 }
      );
    }

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

    const { error: dbError } = await supabase
      .from("leads")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          business_name: businessName,
          service_interest: serviceInterest,
          message,
          source_page: sourcePage,
        },
      ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
