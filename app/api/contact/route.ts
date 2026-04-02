import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Lead capture is not configured on this deployment." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, businessName, serviceInterest, message, sourcePage } = body;

    // 1. Insert lead into Supabase
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
          source_page: sourcePage || "Direct Contact",
        },
      ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    // 2. Later: Send email notification via Resend
    // For now, we just return success

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
