import { supabaseAdmin } from "@/lib/supabase-admin";

export type GuideSource = "non_ro" | "ro";

type GuideDirectorRow = {
  id: string;
  company_number: string;
  company_name: string;
  full_name: string;
  download_code: string | null;
};

export type ResolvedGuideCode = {
  source: GuideSource;
  sourceTable: "ch_directors_non_ro" | "ch_directors_ro";
  row: GuideDirectorRow;
};

const CODE_REGEX = /^[A-Z0-9]{4,12}$/;

export function normalizeGuideCode(input: string) {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidGuideCode(code: string) {
  return CODE_REGEX.test(code);
}

export async function resolveGuideCode(codeRaw: string): Promise<ResolvedGuideCode | null> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const code = normalizeGuideCode(codeRaw);
  if (!isValidGuideCode(code)) {
    return null;
  }

  const selectColumns = "id, company_number, company_name, full_name, download_code";

  const { data: nonRo, error: nonRoError } = await supabaseAdmin
    .from("ch_directors_non_ro")
    .select(selectColumns)
    .eq("download_code", code)
    .limit(1)
    .maybeSingle<GuideDirectorRow>();

  if (nonRoError) {
    throw new Error(`Failed to resolve non-RO guide code: ${nonRoError.message}`);
  }

  if (nonRo) {
    return {
      source: "non_ro",
      sourceTable: "ch_directors_non_ro",
      row: nonRo,
    };
  }

  const { data: ro, error: roError } = await supabaseAdmin
    .from("ch_directors_ro")
    .select(selectColumns)
    .eq("download_code", code)
    .limit(1)
    .maybeSingle<GuideDirectorRow>();

  if (roError) {
    throw new Error(`Failed to resolve RO guide code: ${roError.message}`);
  }

  if (!ro) {
    return null;
  }

  return {
    source: "ro",
    sourceTable: "ch_directors_ro",
    row: ro,
  };
}
