import { NextResponse } from "next/server";
import {
  parseAgentChatPayload,
  runPrequalifyChat,
} from "@/lib/agent-chat";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = parseAgentChatPayload(body);

  if (!payload.message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  try {
    const response = await runPrequalifyChat(payload);

    return NextResponse.json({
      ...response,
      delivery: "standard",
      bypassReview: payload.bypassReview,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process chat.";
    return NextResponse.json({ error: message, source: "prequalify" }, { status: 500 });
  }
}
