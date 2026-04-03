import { NextResponse } from "next/server";
import { runAgent } from "@/lib/runAgent";

type RunAgentPayload = {
  agent?: string;
  input?: unknown;
};

function parseAuthorizationHeader(headerValue: string | null) {
  if (!headerValue) return null;
  if (headerValue.startsWith("Bearer ")) {
    return headerValue.slice("Bearer ".length).trim();
  }
  return headerValue.trim();
}

export async function POST(request: Request) {
  const expectedApiKey = process.env.AGENT_API_KEY;
  const providedApiKey = parseAuthorizationHeader(request.headers.get("authorization"));

  if (!expectedApiKey) {
    return NextResponse.json(
      { error: "Server agent API key is not configured." },
      { status: 500 }
    );
  }

  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: RunAgentPayload;
  try {
    payload = (await request.json()) as RunAgentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const agent = typeof payload.agent === "string" ? payload.agent.trim() : "";
  const input = payload.input;

  if (!agent) {
    return NextResponse.json(
      { error: "Invalid request: 'agent' is required." },
      { status: 400 }
    );
  }

  try {
    const result = await runAgent(agent, input);
    return NextResponse.json({ agent, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.startsWith("Unknown agent:")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to run agent.", details: message },
      { status: 500 }
    );
  }
}
