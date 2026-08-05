import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { newLead } from "@/lib/leadProcessing";

export const runtime = "nodejs";

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;
const WEBHOOK_ENABLED = process.env.CALENDLY_WEBHOOK_ENABLED === "true";

type CalendlyQuestionAnswer = {
  question?: unknown;
  answer?: unknown;
};

type CalendlyTracking = {
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_term?: unknown;
  utm_content?: unknown;
  salesforce_uuid?: unknown;
};

type CalendlyPayload = {
  uri?: unknown;
  name?: unknown;
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  text_reminder_number?: unknown;
  timezone?: unknown;
  cancel_url?: unknown;
  reschedule_url?: unknown;
  questions_and_answers?: unknown;
  tracking?: CalendlyTracking;
  scheduled_event?: {
    uri?: unknown;
    name?: unknown;
    start_time?: unknown;
    end_time?: unknown;
    location?: unknown;
    event_memberships?: unknown;
    event_guests?: unknown;
  };
};

type CalendlyWebhookEvent = {
  event?: unknown;
  created_at?: unknown;
  payload?: CalendlyPayload;
};

function asOptionalString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getSigningKey() {
  return (
    asOptionalString(process.env.CALENDLY_WEBHOOK_SIGNING_KEY) ??
    asOptionalString(process.env.CALENDLY_SIGNING_KEY)
  );
}

function parseSignatureHeader(signatureHeader: string | null) {
  if (!signatureHeader) return null;

  const parts = Object.fromEntries(
    signatureHeader
      .split(",")
      .map((part) => part.trim().split("="))
      .filter((part): part is [string, string] => part.length === 2 && Boolean(part[0] && part[1]))
  );

  const timestamp = asOptionalString(parts.t);
  const signature = asOptionalString(parts.v1);

  return timestamp && signature ? { timestamp, signature } : null;
}

function timingSafeEqualHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) return false;

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isValidCalendlySignature(rawBody: string, signatureHeader: string | null) {
  const signingKey = getSigningKey();
  if (!signingKey) {
    console.error("Calendly webhook rejected: missing CALENDLY_WEBHOOK_SIGNING_KEY.");
    return false;
  }

  const parsedSignature = parseSignatureHeader(signatureHeader);
  if (!parsedSignature) return false;

  const timestampSeconds = Number(parsedSignature.timestamp);
  if (!Number.isFinite(timestampSeconds)) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) return false;

  const signedPayload = `${parsedSignature.timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac("sha256", signingKey)
    .update(signedPayload, "utf8")
    .digest("hex");

  return timingSafeEqualHex(expectedSignature, parsedSignature.signature);
}

function getQuestionAnswers(payload: CalendlyPayload | undefined) {
  if (!Array.isArray(payload?.questions_and_answers)) return [];

  return payload.questions_and_answers
    .map((item): CalendlyQuestionAnswer => (typeof item === "object" && item !== null ? item : {}))
    .map((item) => ({
      question: asOptionalString(item.question),
      answer: asOptionalString(item.answer),
    }))
    .filter((item) => item.question || item.answer);
}

function findAnswer(questionAnswers: CalendlyQuestionAnswer[], pattern: RegExp) {
  const match = questionAnswers.find((item) => pattern.test(asOptionalString(item.question) ?? ""));
  return asOptionalString(match?.answer);
}

function getPhone(payload: CalendlyPayload | undefined, questionAnswers: CalendlyQuestionAnswer[]) {
  return (
    asOptionalString(payload?.text_reminder_number) ??
    findAnswer(questionAnswers, /\b(phone|mobile|telephone|whatsapp)\b/i)
  );
}

function getCompanyName(questionAnswers: CalendlyQuestionAnswer[]) {
  return findAnswer(questionAnswers, /\b(company|business|organisation|organization)\b/i);
}

function getLeadMessage(payload: CalendlyPayload | undefined, questionAnswers: CalendlyQuestionAnswer[]) {
  const answers = questionAnswers
    .map((item) => {
      const question = asOptionalString(item.question);
      const answer = asOptionalString(item.answer);
      if (!question && !answer) return null;
      return `${question ?? "Question"}: ${answer ?? ""}`;
    })
    .filter(Boolean)
    .join("\n");

  const eventName = asOptionalString(payload?.scheduled_event?.name);
  const startTime = asOptionalString(payload?.scheduled_event?.start_time);

  return [
    "Calendly booking created.",
    eventName ? `Event: ${eventName}` : null,
    startTime ? `Start: ${startTime}` : null,
    answers ? `\nInvitee answers:\n${answers}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function getMetadata(event: CalendlyWebhookEvent, questionAnswers: CalendlyQuestionAnswer[]) {
  const payload = event.payload;
  const scheduledEvent = payload?.scheduled_event;

  return {
    calendly_event: asOptionalString(event.event),
    calendly_created_at: asOptionalString(event.created_at),
    calendly_invitee_uri: asOptionalString(payload?.uri),
    calendly_scheduled_event_uri: asOptionalString(scheduledEvent?.uri),
    calendly_scheduled_event_name: asOptionalString(scheduledEvent?.name),
    calendly_start_time: asOptionalString(scheduledEvent?.start_time),
    calendly_end_time: asOptionalString(scheduledEvent?.end_time),
    calendly_timezone: asOptionalString(payload?.timezone),
    calendly_cancel_url: asOptionalString(payload?.cancel_url),
    calendly_reschedule_url: asOptionalString(payload?.reschedule_url),
    calendly_location: scheduledEvent?.location ?? null,
    calendly_questions_and_answers: questionAnswers,
    utm_term: asOptionalString(payload?.tracking?.utm_term),
    utm_content: asOptionalString(payload?.tracking?.utm_content),
    calendly_salesforce_uuid: asOptionalString(payload?.tracking?.salesforce_uuid),
  };
}

export async function POST(req: Request) {
  if (!WEBHOOK_ENABLED) {
    return NextResponse.json({ success: true, disabled: true });
  }

  const rawBody = await req.text();

  if (!isValidCalendlySignature(rawBody, req.headers.get("calendly-webhook-signature"))) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let event: CalendlyWebhookEvent;

  try {
    event = JSON.parse(rawBody) as CalendlyWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (event.event !== "invitee.created") {
    return NextResponse.json({ success: true, ignored: true });
  }

  const payload = event.payload;
  const email = asOptionalString(payload?.email);

  if (!email) {
    console.error("Calendly webhook skipped: invitee.created payload did not include an email.");
    return NextResponse.json({ success: true, skipped: true, reason: "missing_email" });
  }

  const questionAnswers = getQuestionAnswers(payload);
  const leadResult = await newLead({
    name: asOptionalString(payload?.name),
    firstName: asOptionalString(payload?.first_name),
    lastName: asOptionalString(payload?.last_name),
    email,
    phone: getPhone(payload, questionAnswers),
    companyName: getCompanyName(questionAnswers),
    sourcePage: "Calendly Booking",
    source: asOptionalString(payload?.tracking?.utm_source) ?? "calendly",
    medium: asOptionalString(payload?.tracking?.utm_medium) ?? "booking",
    campaign: asOptionalString(payload?.tracking?.utm_campaign),
    userAgent: req.headers.get("user-agent"),
    message: getLeadMessage(payload, questionAnswers),
    metadata: getMetadata(event, questionAnswers),
  });

  return NextResponse.json({
    success: true,
    leadStatus: leadResult.status,
    leadId: leadResult.lead?.lead_id ?? null,
  });
}
