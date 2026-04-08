import { NextResponse } from "next/server";
import { type AgentHistoryItem, type ChatAgentKey, parseAgentChatPayload, runPrequalifyChat } from "@/lib/agent-chat";
import { supabase } from "@/lib/supabase";

const TRIAL_LIMIT = 2;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHAT_AGENT_KEYS: ChatAgentKey[] = ["prequalify", "prequalifyNewBusiness"];

type TranscriptItemRole = "user" | "assistant" | "system";
type TranscriptItemKind = "chat" | "email" | "status";

type TranscriptItem = {
  role: TranscriptItemRole;
  kind: TranscriptItemKind;
  text: string;
  createdAt: string;
};

type SessionRow = {
  session_id: string;
  locale: string;
  user_email: string | null;
  messages_used: number;
  trial_completed_at: string | null;
  report_sent_at: string | null;
  transcript: unknown;
};

function normalizeSessionId(value: unknown) {
  if (typeof value !== "string") return "";
  const nextValue = value.trim();
  return nextValue.length > 0 && nextValue.length <= 120 ? nextValue : "";
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function parseTranscript(value: unknown): TranscriptItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is TranscriptItem => {
      if (!entry || typeof entry !== "object") return false;
      const item = entry as Partial<TranscriptItem>;

      return (
        (item.role === "user" || item.role === "assistant" || item.role === "system") &&
        (item.kind === "chat" || item.kind === "email" || item.kind === "status") &&
        typeof item.text === "string" &&
        typeof item.createdAt === "string"
      );
    })
    .slice(-200);
}

async function getOrCreateSession(sessionId: string, locale: string) {
  if (!supabase) {
    throw new Error("Agent chat persistence is not configured on this deployment.");
  }

  const { data, error } = await supabase
    .from("prequalify_transcripts")
    .select("session_id, locale, user_email, messages_used, trial_completed_at, report_sent_at, transcript")
    .eq("session_id", sessionId)
    .maybeSingle<SessionRow>();

  if (error) {
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  if (data) {
    return data;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("prequalify_transcripts")
    .insert([
      {
        session_id: sessionId,
        locale,
      },
    ])
    .select("session_id, locale, user_email, messages_used, trial_completed_at, report_sent_at, transcript")
    .single<SessionRow>();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Failed to create session.");
  }

  return inserted;
}

function toSessionResponse(session: SessionRow) {
  return {
    sessionId: session.session_id,
    locale: session.locale,
    messagesUsed: session.messages_used,
    trialLimit: TRIAL_LIMIT,
    limitReached: session.messages_used >= TRIAL_LIMIT || Boolean(session.trial_completed_at),
    trialComplete: Boolean(session.trial_completed_at),
    emailCaptured: Boolean(session.user_email),
    email: session.user_email,
    reportSent: Boolean(session.report_sent_at),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = normalizeSessionId(searchParams.get("sessionId"));
  const locale = typeof searchParams.get("locale") === "string" ? searchParams.get("locale") : "en";

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  try {
    const session = await getOrCreateSession(sessionId, locale ?? "en");
    return NextResponse.json(toSessionResponse(session));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedBody = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const action = parsedBody.action === "capture_email" ? "capture_email" : "chat";
  const sessionId = normalizeSessionId(parsedBody.sessionId);
  const agentKey =
    typeof parsedBody.agentKey === "string" && CHAT_AGENT_KEYS.includes(parsedBody.agentKey as ChatAgentKey)
      ? (parsedBody.agentKey as ChatAgentKey)
      : "prequalify";

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const payload = parseAgentChatPayload(body);

  try {
    const session = await getOrCreateSession(sessionId, payload.locale);
    const now = new Date().toISOString();
    const transcript = parseTranscript(session.transcript);

    if (action === "capture_email") {
      const email = normalizeEmail(parsedBody.email);

      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
      }

      const nextTranscript = [
        ...transcript,
        {
          role: "user",
          kind: "email",
          text: email,
          createdAt: now,
        } satisfies TranscriptItem,
        {
          role: "system",
          kind: "status",
          text: "Lead report marked as sent.",
          createdAt: now,
        } satisfies TranscriptItem,
      ];

      const { data: updatedSession, error: updateError } = await supabase!
        .from("prequalify_transcripts")
        .update({
          user_email: email,
          report_sent_at: now,
          trial_completed_at: session.messages_used >= TRIAL_LIMIT ? now : session.trial_completed_at,
          transcript: nextTranscript,
          updated_at: now,
        })
        .eq("session_id", sessionId)
        .select("session_id, locale, user_email, messages_used, trial_completed_at, report_sent_at, transcript")
        .single<SessionRow>();

      if (updateError || !updatedSession) {
        return NextResponse.json(
          { error: updateError?.message ?? "Failed to save email." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ...toSessionResponse(updatedSession),
        captured: true,
      });
    }

    if (!payload.message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (session.messages_used >= TRIAL_LIMIT || Boolean(session.trial_completed_at)) {
      return NextResponse.json(
        {
          ...toSessionResponse(session),
          error: "Trial message limit reached.",
          needsEmail: !session.user_email,
        },
        { status: 429 }
      );
    }

    const history: AgentHistoryItem[] = payload.history;
    const response = await runPrequalifyChat({
      message: payload.message,
      history,
      locale: payload.locale,
      agentKey,
    });

    const nextMessagesUsed = session.messages_used + 1;
    const nextTranscript = [
      ...transcript,
      {
        role: "user",
        kind: "chat",
        text: payload.message,
        createdAt: now,
      } satisfies TranscriptItem,
      {
        role: "assistant",
        kind: "chat",
        text: response.reply,
        createdAt: now,
      } satisfies TranscriptItem,
    ];

    const { data: updatedSession, error: updateError } = await supabase!
      .from("prequalify_transcripts")
      .update({
        locale: payload.locale,
        messages_used: nextMessagesUsed,
        trial_completed_at:
          nextMessagesUsed >= TRIAL_LIMIT
            ? session.trial_completed_at ?? now
            : session.trial_completed_at,
        transcript: nextTranscript,
        updated_at: now,
      })
      .eq("session_id", sessionId)
      .select("session_id, locale, user_email, messages_used, trial_completed_at, report_sent_at, transcript")
      .single<SessionRow>();

    if (updateError || !updatedSession) {
      return NextResponse.json(
        { error: updateError?.message ?? "Failed to save transcript." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...response,
      delivery: "standard",
      bypassReview: payload.bypassReview,
      ...toSessionResponse(updatedSession),
      needsEmail: !updatedSession.user_email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process chat.";
    return NextResponse.json({ error: message, source: "prequalify" }, { status: 500 });
  }
}
