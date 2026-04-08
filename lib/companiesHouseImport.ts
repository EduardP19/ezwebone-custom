import { fetchAdvancedCompaniesPage, type CompaniesHouseCompany } from "@/lib/companiesHouseAPI";
import { fetchCompanyPSC } from "@/lib/companiesHousePSC";
import { supabaseAdmin } from "@/lib/supabase-admin";

type ImportParams = {
  incorporatedFrom: string;
  incorporatedTo: string;
  sicCode: string;
  size: string;
  maxCompanies?: number;
};

type PSCErrorEntry = {
  company_number: string;
  error: string;
};

type DirectorBase = {
  run_id: string;
  company_number: string;
  company_name: string;
  company_status: string | null;
  incorporated_at: string | null;
  sic_codes: string[];
  full_name: string;
  director_full_name: string;
  campaign_status: string;
  industry: string | null;
  nationality_raw: string;
  letter_template: string | null;
  correspondence_address: Record<string, unknown>;
};

type DirectorNonRo = DirectorBase & {
  nationality_normalized: string;
};

type DirectorRo = DirectorBase;

type ImportSummary = {
  runId: string;
  totalHits: number;
  companiesFetched: number;
  activeProcessed: number;
  pscOk: number;
  pscFailed: number;
  roUpserted: number;
  nonRoUpserted: number;
  roSample: DirectorRo[];
  nonRoSample: DirectorNonRo[];
};

function cleanText(value: string) {
  return value
    .toLowerCase()
    .replace(/[._]/g, " ")
    .replace(/[,+/&\\-]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeNationality(raw: string | null | undefined): string {
  if (!raw) return "unknown";

  let value = cleanText(raw);
  if (!value) return "unknown";

  const replacements: Array<[RegExp, string]> = [
    [/\bu k\b/g, "british"],
    [/\buk\b/g, "british"],
    [/\bunited kingdom\b/g, "british"],
    [/\bgreat britain\b/g, "british"],
    [/\bbrit\b/g, "british"],
    [/\bengland\b/g, "british"],
    [/\bscotland\b/g, "british"],
    [/\bwelsh\b/g, "british"],
    [/\bnorthern ireland\b/g, "british"],
    [/\bromania\b/g, "romanian"],
    [/\broumanian\b/g, "romanian"],
    [/\bromanian nationality\b/g, "romanian"],
  ];

  for (const [pattern, replacement] of replacements) {
    value = value.replace(pattern, replacement);
  }

  value = value.replace(/\s+/g, " ").trim();
  return value || "unknown";
}

function toDateOrNull(value: string | undefined) {
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function upsertNonRoRows(rows: DirectorNonRo[]) {
  if (!supabaseAdmin || rows.length === 0) return 0;

  for (const group of chunk(rows, 500)) {
    const { error } = await supabaseAdmin
      .from("ch_directors_non_ro")
      .upsert(group, {
        onConflict: "company_number,director_full_name,nationality_raw",
      });

    if (error) {
      throw new Error(`Failed to upsert non-RO directors: ${error.message}`);
    }
  }

  return rows.length;
}

async function upsertRoRows(rows: DirectorRo[]) {
  if (!supabaseAdmin || rows.length === 0) return 0;

  for (const group of chunk(rows, 500)) {
    const { error } = await supabaseAdmin
      .from("ch_directors_ro")
      .upsert(group, {
        onConflict: "company_number,director_full_name,nationality_raw",
      });

    if (error) {
      throw new Error(`Failed to upsert RO directors: ${error.message}`);
    }
  }

  return rows.length;
}

async function createRun(params: Required<ImportParams>) {
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY is required for Companies House import.");
  }

  const { data, error } = await supabaseAdmin
    .from("ch_import_runs")
    .insert([
      {
        incorporated_from: params.incorporatedFrom,
        incorporated_to: params.incorporatedTo,
        sic_code: params.sicCode,
        size: params.size,
        max_companies: params.maxCompanies,
        status: "running",
      },
    ])
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create import run.");
  }

  return data.id;
}

function isActiveCompany(company: CompaniesHouseCompany) {
  return (company.company_status ?? "").toLowerCase() === "active";
}

export async function runCompaniesHouseImport(input: ImportParams): Promise<ImportSummary> {
  if (!supabaseAdmin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY is required for Companies House import.");
  }

  const params: Required<ImportParams> = {
    incorporatedFrom: input.incorporatedFrom,
    incorporatedTo: input.incorporatedTo,
    sicCode: input.sicCode,
    size: input.size,
    maxCompanies: Math.max(1, Math.min(input.maxCompanies ?? 2000, 10000)),
  };
  const defaultLetterTemplate = process.env.DEFAULT_LETTER_TEMPLATE ?? null;

  const runId = await createRun(params);
  const pages: unknown[] = [];
  const pscErrors: PSCErrorEntry[] = [];
  const collectedCompanies: CompaniesHouseCompany[] = [];
  const nonRoRows: DirectorNonRo[] = [];
  const roRows: DirectorRo[] = [];

  let totalHits = 0;
  let startIndex = 0;
  const itemsPerPage = 100;
  const maxPages = 100;
  let pageCount = 0;

  while (collectedCompanies.length < params.maxCompanies && pageCount < maxPages) {
    const page = await fetchAdvancedCompaniesPage({
      incorporatedFrom: params.incorporatedFrom,
      incorporatedTo: params.incorporatedTo,
      sicCode: params.sicCode,
      size: params.size,
      startIndex,
      itemsPerPage,
    });

    pages.push(page.raw);
    pageCount += 1;

    if (totalHits === 0) {
      totalHits = page.totalResults;
    }

    if (page.items.length === 0) {
      break;
    }

    collectedCompanies.push(...page.items);
    if (collectedCompanies.length >= params.maxCompanies) {
      break;
    }

    const nextIndex = startIndex + page.items.length;
    if (nextIndex >= page.totalResults) {
      break;
    }

    startIndex = nextIndex;
  }

  const companiesFetched = Math.min(collectedCompanies.length, params.maxCompanies);
  const companies = collectedCompanies.slice(0, params.maxCompanies);
  let activeProcessed = 0;
  let pscOk = 0;
  let pscFailed = 0;

  for (const company of companies) {
    if (!company.company_number || !isActiveCompany(company)) {
      continue;
    }

    activeProcessed += 1;

    try {
      const psc = await fetchCompanyPSC(company.company_number);
      pscOk += 1;

      for (const director of psc.items) {
        const directorFullName = (director.name ?? "").trim();
        if (!directorFullName) continue;

        const nationalityRaw = (director.nationality ?? "unknown").trim() || "unknown";
        const nationalityNormalized = normalizeNationality(nationalityRaw);
        const base: DirectorBase = {
          run_id: runId,
          company_number: company.company_number,
          company_name: company.company_name ?? "",
          company_status: company.company_status ?? null,
          incorporated_at: toDateOrNull(company.date_of_creation),
          sic_codes: Array.isArray(company.sic_codes) ? company.sic_codes : [],
          full_name: directorFullName,
          director_full_name: directorFullName,
          campaign_status: "to_send",
          industry: params.sicCode,
          nationality_raw: nationalityRaw,
          letter_template: defaultLetterTemplate,
          correspondence_address:
            director.address && typeof director.address === "object"
              ? (director.address as Record<string, unknown>)
              : {},
        };

        if (nationalityNormalized.includes("romanian")) {
          roRows.push(base);
        } else {
          nonRoRows.push({
            ...base,
            nationality_normalized: nationalityNormalized,
          });
        }
      }
    } catch (error) {
      pscFailed += 1;
      pscErrors.push({
        company_number: company.company_number,
        error: error instanceof Error ? error.message : "Unknown PSC error",
      });
    }
  }

  const [nonRoUpserted, roUpserted] = await Promise.all([
    upsertNonRoRows(nonRoRows),
    upsertRoRows(roRows),
  ]);

  const { error: finalizeError } = await supabaseAdmin
    .from("ch_import_runs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      total_hits: totalHits,
      companies_fetched: companiesFetched,
      active_processed: activeProcessed,
      psc_ok: pscOk,
      psc_failed: pscFailed,
      ro_upserted: roUpserted,
      non_ro_upserted: nonRoUpserted,
      advanced_search_payload: pages,
      psc_errors: pscErrors,
    })
    .eq("id", runId);

  if (finalizeError) {
    throw new Error(`Failed to finalize import run: ${finalizeError.message}`);
  }

  return {
    runId,
    totalHits,
    companiesFetched,
    activeProcessed,
    pscOk,
    pscFailed,
    roUpserted,
    nonRoUpserted,
    roSample: roRows.slice(0, 10),
    nonRoSample: nonRoRows.slice(0, 10),
  };
}
