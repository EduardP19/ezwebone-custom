import { NextResponse } from "next/server";
import { type AgentHistoryItem, type ChatAgentKey, parseAgentChatPayload, runPrequalifyChat } from "@/lib/agent-chat";
import { newLead } from "@/lib/leadProcessing";
import { supabase } from "@/lib/supabase";

const TRIAL_LIMIT = 5;
const CONTACT_FOLLOWUP_LIMIT = 3;
const OFFTOPIC_STRIKE_LIMIT = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_CAPTURE_REGEX = /[^\s@]+@[^\s@]+\.[^\s@]+/i;
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

type CapturedContact = {
  email: string;
  name: string;
  complete: boolean;
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

function capitalizeNameToken(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function sanitizeNameCandidate(value: string) {
  if (typeof value !== "string") return "";

  const stopwords = new Set([
    "and",
    "e",
    "email",
    "este",
    "is",
    "mail",
    "meu",
    "my",
    "name",
    "numele",
    "si",
  ]);

  const tokens =
    value
      .replace(EMAIL_CAPTURE_REGEX, " ")
      .replace(/[_|/\\]+/g, " ")
      .match(/\p{L}+(?:['’-]\p{L}+)*/gu) ?? [];

  const filtered = tokens.filter((token) => !stopwords.has(token.toLowerCase()));

  if (filtered.length === 0 || filtered.length > 4) {
    return "";
  }

  return filtered.map(capitalizeNameToken).join(" ");
}

function extractEmailFromText(value: string) {
  const match = value.match(EMAIL_CAPTURE_REGEX);
  return match?.[0]?.trim().toLowerCase() ?? "";
}

function extractNameFromText(value: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "";
  }

  const explicitNameMatch = value.match(
    /(?:my name is|name is|name\s*[:=-]|numele meu este|ma numesc)\s*([^\n,;|]+)/iu
  );

  if (explicitNameMatch?.[1]) {
    const explicitName = sanitizeNameCandidate(explicitNameMatch[1]);
    if (explicitName) {
      return explicitName;
    }
  }

  const emailMatch = value.match(EMAIL_CAPTURE_REGEX);
  if (!emailMatch || typeof emailMatch.index !== "number") {
    return "";
  }

  const prefix = value.slice(0, emailMatch.index).trim();
  if (!prefix) {
    return "";
  }

  const segments = prefix
    .split(/[\n,;|]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const candidate = sanitizeNameCandidate(segments[index] ?? "");
    if (candidate) {
      return candidate;
    }
  }

  return sanitizeNameCandidate(prefix);
}

function inferNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const token = localPart.split(/[._-]+/).find(Boolean) ?? "Lead";
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

function extractCapturedContact(transcript: TranscriptItem[], fallbackEmail?: string | null): CapturedContact {
  let email = normalizeEmail(fallbackEmail);
  let name = "";

  for (let index = transcript.length - 1; index >= 0; index -= 1) {
    const item = transcript[index];
    if (!item || item.role !== "user") {
      continue;
    }

    if (!email) {
      email =
        item.kind === "email"
          ? normalizeEmail(item.text)
          : extractEmailFromText(item.text);
    }

    if (!name && item.kind === "chat") {
      name = extractNameFromText(item.text);
    }

    if (email && name) {
      break;
    }
  }

  return {
    email,
    name,
    complete: Boolean(email && name),
  };
}

function applyContactFromUserEntry(contact: CapturedContact, item: Pick<TranscriptItem, "kind" | "text">): CapturedContact {
  let email = contact.email;
  let name = contact.name;

  if (!email) {
    email = item.kind === "email" ? normalizeEmail(item.text) : extractEmailFromText(item.text);
  }

  if (!name && item.kind === "chat") {
    name = extractNameFromText(item.text);
  }

  return {
    email,
    name,
    complete: Boolean(email && name),
  };
}

function countContactFollowupAttempts(transcript: TranscriptItem[], fallbackEmail?: string | null) {
  let qualifyingUserMessages = 0;
  let followupAttempts = 0;
  let contact: CapturedContact = {
    email: normalizeEmail(fallbackEmail),
    name: "",
    complete: false,
  };

  for (const item of transcript) {
    if (!item || item.role !== "user" || (item.kind !== "chat" && item.kind !== "email")) {
      continue;
    }

    contact = applyContactFromUserEntry(contact, item);

    if (item.kind === "chat") {
      if (qualifyingUserMessages >= TRIAL_LIMIT && !contact.complete) {
        followupAttempts += 1;
      }
      qualifyingUserMessages += 1;
    }
  }

  return followupAttempts;
}

function countUserChatMessages(transcript: TranscriptItem[]) {
  return transcript.filter((item) => item.role === "user" && item.kind === "chat").length;
}

function countOffTopicStrikes(transcript: TranscriptItem[]) {
  return transcript.filter(
    (item) =>
      item.role === "system" &&
      item.kind === "status" &&
      item.text.startsWith("off_topic_strike:")
  ).length;
}

function isSeverelyAbusiveMessage(text: string) {
  const normalized = text.toLowerCase();
  return /\b(fuck|f\*+k|shit|bitch|asshole|idiot|moron|stupid)\b/.test(normalized);
}

function hasBusinessKeyword(text: string) {
  const normalized = text.toLowerCase();
  return /\b(business|company|store|shop|e-?commerce|website|seo|traffic|lead|marketing|sales|booking|service|services|clients?|customer|team|employee|automations?|ai|agent)\b/.test(
    normalized
  );
}

function isLikelyRelevantMessage(text: string) {
  if (EMAIL_CAPTURE_REGEX.test(text)) return true;
  if (hasBusinessKeyword(text)) return true;

  const normalized = text.trim().toLowerCase();
  if (/(^|\s)(yes|no|maybe|not sure)(\s|$)/.test(normalized) && normalized.length <= 20) {
    return false;
  }

  const words = normalized.match(/[a-zA-Z]+/g) ?? [];
  return words.length >= 5;
}

function isReallyOffTopicMessage(text: string) {
  const normalized = text.trim();
  if (!normalized) return true;
  if (/^[\d\W_]+$/.test(normalized)) return true;
  const words = normalized.match(/[a-zA-Z]+/g) ?? [];
  return words.length <= 1;
}

function shouldCountOffTopicStrike(text: string, priorUserChatCount: number) {
  if (isLikelyRelevantMessage(text)) {
    return false;
  }

  if (priorUserChatCount === 0) {
    return isReallyOffTopicMessage(text);
  }

  return true;
}

function getContactLimitMessage(locale: string) {
  if (locale === "ro") {
    return "Multumesc. Cel mai bun pas acum este un apel strategic scurt ca sa iti oferim direct prioritatile pentru afacerea ta.";
  }

  return "Thanks. The best next step now is a short strategy call so we can map your exact business priorities.";
}

function getAbuseLimitMessage(locale: string) {
  if (locale === "ro") {
    return "Nu putem continua chatul cu limbaj abuziv. Daca vrei ajutor real pentru afacerea ta, programeaza un apel.";
  }

  return "We can’t continue this chat with abusive language. If you want practical help for your business, please book a call.";
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
  const transcript = parseTranscript(session.transcript);
  const contact = extractCapturedContact(transcript, session.user_email);
  const contactFollowupAttempts = countContactFollowupAttempts(transcript, session.user_email);
  const offTopicStrikes = countOffTopicStrikes(transcript);
  const contactCollectionOnly =
    session.messages_used >= TRIAL_LIMIT && !contact.complete && !session.trial_completed_at;
  const contactFollowupLimitReached =
    session.messages_used >= TRIAL_LIMIT &&
    !contact.complete &&
    contactFollowupAttempts >= CONTACT_FOLLOWUP_LIMIT;

  return {
    sessionId: session.session_id,
    locale: session.locale,
    messagesUsed: session.messages_used,
    trialLimit: TRIAL_LIMIT,
    limitReached: Boolean(session.trial_completed_at),
    trialComplete: Boolean(session.trial_completed_at),
    contactCollectionOnly,
    handoffRequired: contactFollowupLimitReached || Boolean(session.trial_completed_at && !contact.complete),
    offTopicStrikes,
    offTopicStrikeLimit: OFFTOPIC_STRIKE_LIMIT,
    contactFollowupAttempts,
    contactFollowupLimit: CONTACT_FOLLOWUP_LIMIT,
    emailCaptured: Boolean(contact.email),
    nameCaptured: Boolean(contact.name),
    contactCaptured: contact.complete,
    needsEmail: !contact.email,
    needsName: !contact.name,
    needsContact: !contact.complete,
    email: contact.email || session.user_email,
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

      try {
        const transcriptPreview = nextTranscript
          .filter((item) => item.kind === "chat")
          .slice(-8)
          .map((item) => `${item.role}: ${item.text}`)
          .join("\n")
          .slice(0, 3500);

        await newLead({
          firstName: inferNameFromEmail(email),
          email,
          sourcePage: agentKey === "prequalifyNewBusiness" ? "AI Chat - New Business" : "AI Chat - Homepage",
          source: "chat_widget",
          campaign: agentKey === "prequalifyNewBusiness" ? "first_letter_ro_director" : "prequalify_homepage",
          medium: "ai_chat",
          sessionId,
          userAgent: request.headers.get("user-agent"),
          agentKey,
          transcriptSessionId: sessionId,
          message: transcriptPreview,
          metadata: {
            transcript_id: sessionId,
            transcript_messages_used: updatedSession.messages_used,
            transcript_trial_completed_at: updatedSession.trial_completed_at,
            transcript_report_sent_at: updatedSession.report_sent_at,
            locale: updatedSession.locale,
          },
        });
      } catch (leadError) {
        console.error("Failed to sync captured email into leads:", leadError);
      }

      return NextResponse.json({
        ...toSessionResponse(updatedSession),
        captured: true,
      });
    }

    if (!payload.message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const priorUserChatCount = countUserChatMessages(transcript);
    const existingOffTopicStrikes = countOffTopicStrikes(transcript);
    const severeAbuse = isSeverelyAbusiveMessage(payload.message);
    const addOffTopicStrike = shouldCountOffTopicStrike(payload.message, priorUserChatCount);
    const projectedOffTopicStrikes = existingOffTopicStrikes + (addOffTopicStrike ? 1 : 0);

    if (severeAbuse || projectedOffTopicStrikes >= OFFTOPIC_STRIKE_LIMIT) {
      const handoffReply = severeAbuse
        ? getAbuseLimitMessage(payload.locale)
        : getContactLimitMessage(payload.locale);
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
          text: handoffReply,
          createdAt: now,
        } satisfies TranscriptItem,
        {
          role: "system",
          kind: "status",
          text: severeAbuse
            ? "chat_ban:abusive_language"
            : `off_topic_strike:${projectedOffTopicStrikes}`,
          createdAt: now,
        } satisfies TranscriptItem,
        {
          role: "system",
          kind: "status",
          text: severeAbuse
            ? "Chat ended due to abusive language."
            : "Off-topic strike limit reached. Handoff to strategy call.",
          createdAt: now,
        } satisfies TranscriptItem,
      ];

      const { data: updatedSession, error: banUpdateError } = await supabase!
        .from("prequalify_transcripts")
        .update({
          locale: payload.locale,
          messages_used: nextMessagesUsed,
          trial_completed_at: session.trial_completed_at ?? now,
          transcript: nextTranscript,
          updated_at: now,
        })
        .eq("session_id", sessionId)
        .select("session_id, locale, user_email, messages_used, trial_completed_at, report_sent_at, transcript")
        .single<SessionRow>();

      if (banUpdateError || !updatedSession) {
        return NextResponse.json(
          { error: banUpdateError?.message ?? "Failed to save transcript." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        agent: agentKey,
        status: "ok",
        reply: handoffReply,
        model: "system",
        delivery: "standard",
        bypassReview: payload.bypassReview,
        ...toSessionResponse(updatedSession),
      });
    }

    const currentContact = extractCapturedContact(transcript, session.user_email);
    const contactFollowupAttempts = countContactFollowupAttempts(transcript, session.user_email);
    const contactCollectionPhase = session.messages_used >= TRIAL_LIMIT && !currentContact.complete;
    const contactLimitAlreadyReached = contactCollectionPhase && contactFollowupAttempts >= CONTACT_FOLLOWUP_LIMIT;

    if (contactLimitAlreadyReached) {
      return NextResponse.json(
        {
          ...toSessionResponse(session),
          error: "Contact collection limit reached.",
          handoffRequired: true,
        },
        { status: 429 }
      );
    }

    const projectedContact = applyContactFromUserEntry(currentContact, {
      kind: "chat",
      text: payload.message,
    });
    const projectedFollowupAttempts =
      contactCollectionPhase && !projectedContact.complete
        ? contactFollowupAttempts + 1
        : contactFollowupAttempts;
    const shouldHandoffNow =
      contactCollectionPhase &&
      !projectedContact.complete &&
      projectedFollowupAttempts >= CONTACT_FOLLOWUP_LIMIT;

    if (shouldHandoffNow) {
      const handoffReply = getContactLimitMessage(payload.locale);
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
          text: handoffReply,
          createdAt: now,
        } satisfies TranscriptItem,
        {
          role: "system",
          kind: "status",
          text: "Contact follow-up limit reached. Handoff to strategy call.",
          createdAt: now,
        } satisfies TranscriptItem,
      ];

      const { data: updatedSession, error: handoffUpdateError } = await supabase!
        .from("prequalify_transcripts")
        .update({
          locale: payload.locale,
          messages_used: nextMessagesUsed,
          user_email: projectedContact.email || session.user_email,
          trial_completed_at: session.trial_completed_at ?? now,
          transcript: nextTranscript,
          updated_at: now,
        })
        .eq("session_id", sessionId)
        .select("session_id, locale, user_email, messages_used, trial_completed_at, report_sent_at, transcript")
        .single<SessionRow>();

      if (handoffUpdateError || !updatedSession) {
        return NextResponse.json(
          { error: handoffUpdateError?.message ?? "Failed to save transcript." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        agent: agentKey,
        status: "ok",
        reply: handoffReply,
        model: "system",
        delivery: "standard",
        bypassReview: payload.bypassReview,
        ...toSessionResponse(updatedSession),
      });
    }

    const canContinue =
      !session.trial_completed_at &&
      (session.messages_used < TRIAL_LIMIT || !currentContact.complete);

    if (!canContinue) {
      return NextResponse.json(
        {
          ...toSessionResponse(session),
          error: "Trial message limit reached.",
          needsContact: !currentContact.complete,
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
      ...(addOffTopicStrike
        ? [
            {
              role: "system" as const,
              kind: "status" as const,
              text: `off_topic_strike:${projectedOffTopicStrikes}`,
              createdAt: now,
            },
          ]
        : []),
    ];
    const nextContact = extractCapturedContact(nextTranscript, session.user_email);
    const shouldComplete = nextMessagesUsed >= TRIAL_LIMIT && nextContact.complete;

    const { data: updatedSession, error: updateError } = await supabase!
      .from("prequalify_transcripts")
      .update({
        locale: payload.locale,
        messages_used: nextMessagesUsed,
        user_email: nextContact.email || session.user_email,
        trial_completed_at:
          shouldComplete
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

    if (!currentContact.complete && nextContact.complete) {
      try {
        const transcriptPreview = nextTranscript
          .filter((item) => item.kind === "chat")
          .slice(-10)
          .map((item) => `${item.role}: ${item.text}`)
          .join("\n")
          .slice(0, 3500);

        await newLead({
          name: nextContact.name,
          email: nextContact.email,
          sourcePage: agentKey === "prequalifyNewBusiness" ? "AI Chat - New Business" : "AI Chat - Homepage",
          source: "chat_widget",
          campaign: agentKey === "prequalifyNewBusiness" ? "first_letter_ro_director" : "prequalify_homepage",
          medium: "ai_chat",
          sessionId,
          userAgent: request.headers.get("user-agent"),
          agentKey,
          transcriptSessionId: sessionId,
          message: transcriptPreview,
          metadata: {
            transcript_id: sessionId,
            transcript_messages_used: updatedSession.messages_used,
            transcript_trial_completed_at: updatedSession.trial_completed_at,
            transcript_report_sent_at: updatedSession.report_sent_at,
            locale: updatedSession.locale,
          },
        });
      } catch (leadError) {
        console.error("Failed to sync chat contact into leads:", leadError);
      }
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
