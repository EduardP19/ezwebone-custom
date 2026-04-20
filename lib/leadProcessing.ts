import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";

type LeadRow = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  submissions: number;
  lead_id: string | null;
  metadata: Record<string, unknown> | null;
};

type NewLeadInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  sourcePage?: string | null;
  source?: string | null;
  campaign?: string | null;
  medium?: string | null;
  sessionId?: string | null;
  country?: string | null;
  userAgent?: string | null;
  message?: string | null;
  hasWebsite?: boolean | null;
  niche?: string | null;
  companyName?: string | null;
  companyNumber?: string | null;
  discount?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  agentKey?: string | null;
  transcriptSessionId?: string | null;
  metadata?: Record<string, unknown>;
};

type LeadProcessingResult = {
  status: "inserted" | "updated" | "skipped";
  lead: LeadRow | null;
};

function asOptionalString(value: unknown) {
  if (typeof value !== "string") return null;
  const nextValue = value.trim();
  return nextValue.length > 0 ? nextValue : null;
}

function normalizeEmail(value: unknown) {
  const email = asOptionalString(value);
  return email ? email.toLowerCase() : "";
}

function guessFirstNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const token = localPart.split(/[._-]+/).find(Boolean) ?? "Lead";
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function formatPersonName(fullName: string | null | undefined) {
  if (!fullName || typeof fullName !== "string") {
    return { first_name: "", last_name: "", fullNameClean: "" };
  }

  let clean = fullName.trim().replace(/\s+/g, " ");
  clean = clean.replace(/^(mr|mrs|miss|ms|dr)\.?\s+/i, "");

  if (!clean) {
    return { first_name: "", last_name: "", fullNameClean: "" };
  }

  const tokens = clean.split(/[\s-]+/).filter(Boolean);

  const capHyphenated = (value: string) =>
    value
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("-");

  const first_name = capHyphenated(tokens[0]);
  const last_name = tokens.length > 1 ? capHyphenated(tokens[tokens.length - 1]) : "";
  const fullNameClean = tokens.map(capHyphenated).join(" ");

  return { first_name, last_name, fullNameClean };
}

export function formatPhoneNumber(phone: string | null | undefined) {
  const countryCode = "44";

  if (!phone || typeof phone !== "string") {
    return null;
  }

  const clean = phone.replace(/[\s\-().]/g, "");
  if (!clean) return null;

  if (clean.startsWith("+")) return clean;
  if (clean.startsWith("00")) return `+${clean.slice(2)}`;
  if (clean.startsWith("07")) return `+${countryCode}${clean.slice(1)}`;
  if (clean.startsWith("7")) return `+${countryCode}${clean}`;
  if (clean.startsWith("44")) return `+${clean}`;

  return clean;
}

function generateLeadId() {
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const sec = String(now.getSeconds()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 90 + 10);

  return `L-${yy}${mm}${dd}-${hh}${min}${sec}-${rand}`;
}

export async function newLead(input: NewLeadInput): Promise<LeadProcessingResult> {
  const email = normalizeEmail(input.email);
  if (!email) {
    return { status: "skipped", lead: null };
  }

  const privilegedMode = Boolean(supabaseAdmin);
  const db = supabaseAdmin ?? supabase;
  if (!db) {
    throw new Error("Supabase is not configured for lead processing.");
  }

  const formattedName = formatPersonName(input.name ?? null);
  const firstName =
    (asOptionalString(input.firstName) ?? formattedName.first_name) || guessFirstNameFromEmail(email);
  const lastName = (asOptionalString(input.lastName) ?? formattedName.last_name) || null;
  const phone = formatPhoneNumber(input.phone ?? null);
  const now = new Date().toISOString();

  const incomingMetadata = {
    ...(input.metadata ?? {}),
    source: asOptionalString(input.source),
    campaign: asOptionalString(input.campaign),
    medium: asOptionalString(input.medium),
    sessionId: asOptionalString(input.sessionId),
    country: asOptionalString(input.country),
    userAgent: asOptionalString(input.userAgent),
    agentKey: asOptionalString(input.agentKey),
    transcriptSessionId: asOptionalString(input.transcriptSessionId),
  };

  if (!privilegedMode) {
    const payload = {
      lead_id: generateLeadId(),
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      business_name: asOptionalString(input.companyName),
      message: asOptionalString(input.message),
      source_page: asOptionalString(input.sourcePage) ?? "Direct Contact",
      source: asOptionalString(input.source),
      campaign: asOptionalString(input.campaign),
      medium: asOptionalString(input.medium),
      session_id: asOptionalString(input.sessionId),
      country: asOptionalString(input.country),
      user_agent: asOptionalString(input.userAgent),
      has_website: typeof input.hasWebsite === "boolean" ? input.hasWebsite : null,
      niche: asOptionalString(input.niche),
      company_number: asOptionalString(input.companyNumber),
      discount: asOptionalString(input.discount),
      submissions: 1,
      first_seen_at: now,
      last_submitted_at: now,
      agent_key: asOptionalString(input.agentKey),
      transcript_session_id: asOptionalString(input.transcriptSessionId),
      metadata: incomingMetadata,
    };

    const { data: inserted, error: insertError } = await db
      .from("leads")
      .insert([payload])
      .select("id, email, first_name, last_name, submissions, lead_id, metadata")
      .single<LeadRow>();

    if (insertError) {
      throw new Error(`Failed to insert lead: ${insertError.message}`);
    }

    return {
      status: "inserted",
      lead: inserted,
    };
  }

  const { data: matches, error: queryError } = await db
    .from("leads")
    .select("id, email, first_name, last_name, submissions, lead_id, metadata")
    .ilike("email", email)
    .order("created_at", { ascending: true })
    .limit(25);

  if (queryError) {
    throw new Error(`Failed to query leads: ${queryError.message}`);
  }

  const existing = (matches ?? []).find((item) => (item.email ?? "").toLowerCase() === email) as LeadRow | undefined;

  if (!existing) {
    const payload = {
      lead_id: generateLeadId(),
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      business_name: asOptionalString(input.companyName),
      message: asOptionalString(input.message),
      source_page: asOptionalString(input.sourcePage) ?? "Direct Contact",
      source: asOptionalString(input.source),
      campaign: asOptionalString(input.campaign),
      medium: asOptionalString(input.medium),
      session_id: asOptionalString(input.sessionId),
      country: asOptionalString(input.country),
      user_agent: asOptionalString(input.userAgent),
      has_website: typeof input.hasWebsite === "boolean" ? input.hasWebsite : null,
      niche: asOptionalString(input.niche),
      company_number: asOptionalString(input.companyNumber),
      discount: asOptionalString(input.discount),
      submissions: 1,
      first_seen_at: now,
      last_submitted_at: now,
      agent_key: asOptionalString(input.agentKey),
      transcript_session_id: asOptionalString(input.transcriptSessionId),
      metadata: incomingMetadata,
    };

    const { data: inserted, error: insertError } = await db
      .from("leads")
      .insert([payload])
      .select("id, email, first_name, last_name, submissions, lead_id, metadata")
      .single<LeadRow>();

    if (insertError) {
      throw new Error(`Failed to insert lead: ${insertError.message}`);
    }

    return {
      status: "inserted",
      lead: inserted,
    };
  }

  const submissions = (existing.submissions ?? 0) + 1;
  const mergedMetadata = {
    ...((existing.metadata as Record<string, unknown> | null) ?? {}),
    ...incomingMetadata,
  };

  const { data: updated, error: updateError } = await db
    .from("leads")
    .update({
      lead_id: existing.lead_id ?? generateLeadId(),
      submissions,
      last_submitted_at: now,
      updated_at: now,
      first_name: existing.first_name ?? firstName,
      last_name: existing.last_name ?? lastName,
      phone,
      business_name: asOptionalString(input.companyName),
      message: asOptionalString(input.message),
      source_page: asOptionalString(input.sourcePage) ?? "Direct Contact",
      source: asOptionalString(input.source),
      campaign: asOptionalString(input.campaign),
      medium: asOptionalString(input.medium),
      session_id: asOptionalString(input.sessionId),
      country: asOptionalString(input.country),
      user_agent: asOptionalString(input.userAgent),
      has_website: typeof input.hasWebsite === "boolean" ? input.hasWebsite : null,
      niche: asOptionalString(input.niche),
      company_number: asOptionalString(input.companyNumber),
      discount: asOptionalString(input.discount),
      agent_key: asOptionalString(input.agentKey),
      transcript_session_id: asOptionalString(input.transcriptSessionId),
      metadata: mergedMetadata,
    })
    .eq("id", existing.id)
    .select("id, email, first_name, last_name, submissions, lead_id, metadata")
    .single<LeadRow>();

  if (updateError) {
    throw new Error(`Failed to update lead: ${updateError.message}`);
  }

  return {
    status: "updated",
    lead: updated,
  };
}
