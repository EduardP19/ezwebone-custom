import { supabaseAdmin } from "@/lib/supabase-admin";

const STANNP_API_KEY_FALLBACK = "15c0a9ca53da5dcba52a58a2";

type DirectorAddress = {
  premises?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  locality?: string;
  postal_code?: string;
};

type DirectorRow = {
  id: string;
  company_number: string;
  company_name: string;
  full_name: string;
  correspondence_address: DirectorAddress | null;
  company_status: string | null;
  campaign_status: string;
  industry: string | null;
  qr_code_link: string | null;
  download_code: string | null;
  letter_template: string | null;
};

type StannpResponse = {
  data?: {
    id?: string;
    pdf?: string;
    status?: string;
    cost?: number;
  };
  [key: string]: unknown;
};

type PostLetterPayload = {
  test: boolean;
  template: number;
  recipient: Record<string, unknown>;
  tags?: string;
};

export type SendSource = "non_ro" | "ro";

function toBase64(value: string) {
  return Buffer.from(value).toString("base64");
}

function asString(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  const nextValue = value.trim();
  return nextValue.length > 0 ? nextValue : fallback;
}

function normalizeLetterFullName(rawName: string) {
  const cleanName = asString(rawName).replace(/\s+/g, " ");
  if (!cleanName) return "";

  const parts = cleanName.split(" ");
  const isPrefix = (value: string) => /^(mr|mrs|dr|ms|miss)[\.,]*$/i.test(value);

  let index = 0;
  while (index < parts.length && isPrefix(parts[index] ?? "")) {
    index += 1;
  }

  return parts.slice(index).join(" ").trim();
}

const SIC_LABELS: Record<string, string> = {
  "96020": "beauty",
  "96021": "hairdressing",
  "96040": "wellness",
  "86220": "medical",
};

function resolveIndustryLabel(rawIndustry: string | null) {
  const value = asString(rawIndustry, "servicii");
  const normalized = value.toLowerCase();
  for (const [sic, label] of Object.entries(SIC_LABELS)) {
    if (normalized.includes(sic)) {
      return label;
    }
  }
  return value;
}

function resolveBodyTemplate(item: DirectorRow) {
  const normalizedName = normalizeLetterFullName(item.full_name);
  const firstName = asString(normalizedName).split(/\s+/)[0] || "antreprenor";
  const niche = resolveIndustryLabel(item.industry);
  const downloadCode = asString(item.download_code, "");
  const customBody = asString(item.letter_template);

  return {
    headline: "Companies House ne-a informat despre firma ta",
    body:
      customBody ||
      `Salut ${firstName},\n\nIn ${niche}, primul client vine greu, iar urmatorii vin doar daca prezenta ta online inspira incredere.\n\nCand pornesti un business nou, website-ul este primul filtru prin care clientii decid daca te aleg sau merg mai departe.\n\nLa EZWebOne construim website-uri si prezenta digitala pentru firme aflate la inceput de drum, cu accent pe imagine, claritate si incredere.\n\nDaca un client te-ar descoperi astazi online, ar intelege clar ce oferi si de ce sa te aleaga? Raspunsul incepe cu o prezenta online corecta.\n\nCu stima,\nEduard Proca\nCEO & Fondator EZWebOne`,
    highlightText: `Ghid gratuit: www.ezwebone.co.uk/ro/guides sau scaneaza QR si introdu codul.`,
    qrContentDescription: [
      "Acest ghid iti arata:",
      "• ce ai nevoie cu adevarat la inceput",
      "• cum sa atragi primii clienti fara bugete mari",
      "• cum sa eviti dependenta de platforme ca treatwell",
    ].join("\n"),
    footer: "EZWebOne este numele de trading al companiei EMAGF LTD (UK), inregistrata cu numarul 12437054.",
    privacyNotice: "Datele de contact provin din registre publice UK Companies House.",
  };
}

export async function postLetter(payload: PostLetterPayload): Promise<StannpResponse> {
  const apiUrl = process.env.STANNP_API_URL ?? "https://api-eu1.stannp.com/v1/letters/create";
  const apiKey = process.env.STANNP_API_KEY ?? STANNP_API_KEY_FALLBACK;

  if (!apiKey) {
    throw new Error("Missing STANNP_API_KEY.");
  }

  if (!payload?.recipient?.full_name) {
    throw new Error("Payload recipient.full_name is required.");
  }

  const basic = toBase64(`${apiKey}:`);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basic}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await res.text();
  let data: StannpResponse;
  try {
    data = text ? (JSON.parse(text) as StannpResponse) : {};
  } catch {
    data = { raw: text } as StannpResponse;
  }

  if (!res.ok) {
    throw new Error(
      `Stannp error (${res.status}): ${
        asString((data as Record<string, unknown>).message) ||
        asString((data as Record<string, unknown>).error) ||
        text ||
        "Unknown error"
      }`
    );
  }

  return data;
}

function getSourceTable(source: SendSource) {
  return source === "ro" ? "ch_directors_ro" : "ch_directors_non_ro";
}

function buildPayload(item: DirectorRow, source: SendSource, templateId: number, test: boolean) {
  const address = (item.correspondence_address ?? {}) as DirectorAddress;
  const address1 = `${asString(address.premises)} ${asString(address.address_line_1)}`.trim();
  const address2 = asString(address.address_line_2);
  const address3 = asString(address.address_line_3);
  const city = asString(address.locality);
  const postcode = asString(address.postal_code);
  const downloadCode = asString(item.download_code);
  const copy = resolveBodyTemplate(item);
  const normalizedFullName = normalizeLetterFullName(item.full_name) || asString(item.full_name);

  const payload: PostLetterPayload = {
    test,
    template: templateId,
    recipient: {
      full_name: normalizedFullName,
      company: item.company_name,
      address1,
      address2,
      address3,
      city,
      postcode,
      headline: copy.headline,
      code: downloadCode ? `Codul tau este: ${downloadCode}` : "Codul tau este:",
      body: copy.body,
      highlight_text: copy.highlightText,
      purl: asString(item.qr_code_link),
      qr_content_description: copy.qrContentDescription,
      footer: copy.footer,
      privacy_notice: copy.privacyNotice,
    },
    tags: source === "ro" ? "first_send,letter,ro" : "first_send,letter,non_ro",
  };

  return payload;
}

export async function sendTestLetterPreviewByCompany(params: {
  companyNumber: string;
  source?: SendSource;
  templateId?: number;
  test?: boolean;
}) {
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY is required for Stannp operations.");
  }

  const source = params.source ?? "non_ro";
  const test = params.test ?? true;
  const sourceTable = getSourceTable(source);
  const companyNumber = params.companyNumber.trim();
  if (!companyNumber) {
    throw new Error("companyNumber is required.");
  }

  const templateId = Number(params.templateId ?? process.env.STANNP_TEMPLATE_ID ?? 723214);
  if (!Number.isFinite(templateId) || templateId <= 0) {
    throw new Error("A valid STANNP template id is required.");
  }

  const { data: row, error } = await supabaseAdmin
    .from(sourceTable)
    .select(
      "id, company_number, company_name, full_name, correspondence_address, company_status, campaign_status, industry, qr_code_link, download_code, letter_template"
    )
    .eq("company_number", companyNumber)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<DirectorRow>();

  if (error) {
    throw new Error(`Failed to load company row: ${error.message}`);
  }

  if (!row) {
    throw new Error(`No ${source} row found for company number ${companyNumber}.`);
  }

  const payload = buildPayload(row, source, templateId, test);
  const response = await postLetter(payload);

  return {
    mode: test ? "preview_test" : "preview_live",
    test,
    source,
    sourceTable,
    sourceRowId: row.id,
    companyNumber: row.company_number,
    templateId,
    response,
    payload,
  };
}

export async function sendDueLetters(params?: {
  test?: boolean;
  limit?: number;
  source?: SendSource;
  templateId?: number;
}) {
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY is required for Stannp operations.");
  }

  const test = params?.test ?? true;
  const limit = Math.max(1, Math.min(params?.limit ?? 25, 100));
  const source = params?.source ?? "non_ro";
  const sourceTable = getSourceTable(source);
  const templateId = Number(params?.templateId ?? process.env.STANNP_TEMPLATE_ID ?? 723214);
  if (!Number.isFinite(templateId) || templateId <= 0) {
    throw new Error("A valid STANNP template id is required.");
  }

  const { data: rows, error } = await supabaseAdmin
    .from(sourceTable)
    .select(
      "id, company_number, company_name, full_name, correspondence_address, company_status, campaign_status, industry, qr_code_link, download_code, letter_template"
    )
    .eq("campaign_status", "to_send")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch due letters: ${error.message}`);
  }

  const items = (rows ?? []) as DirectorRow[];
  let sentCount = 0;
  const errors: Array<{ rowId: string; error: string }> = [];

  for (const item of items) {
    try {
      const payload = buildPayload(item, source, templateId, test);

      const response = await postLetter(payload);
      const letterStatus = asString(response.data?.status, "sent");
      const now = new Date().toISOString();

      if (!test) {
        const { error: updateError } = await supabaseAdmin
          .from(sourceTable)
          .update({
            campaign_status: "letter_sent",
            updated_at: now,
          })
          .eq("id", item.id);

        if (updateError) {
          throw new Error(`Failed to update campaign status: ${updateError.message}`);
        }
      }

      const { error: insertError } = await supabaseAdmin
        .from("letters_sent")
        .insert([
          {
            campaign_id: null,
            company_number: item.company_number,
            letter_link: response.data?.pdf ?? null,
            letter_id: response.data?.id ?? null,
            status: letterStatus,
            cost: response.data?.cost ?? null,
            raw_response: {
              response,
              source_table: sourceTable,
              source_row_id: item.id,
              payload,
              sent_at: now,
            },
          },
        ]);

      if (insertError) {
        throw new Error(`Failed to insert letters_sent: ${insertError.message}`);
      }

      sentCount += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push({ rowId: item.id, error: message });

      if (!test) {
        await supabaseAdmin
          .from(sourceTable)
          .update({
            campaign_status: "send_failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
      }
    }
  }

  return {
    queued: items.length,
    sent: sentCount,
    failed: errors.length,
    errors,
    test,
    source,
    templateId,
  };
}
