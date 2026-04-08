const BASE_URL = "https://api.company-information.service.gov.uk";

// Kept as local constant by request (same approach as Wix reference files).
const apiKey = "eb3d1e89-6af3-4ffb-a899-ccbb75f222fb";

export type CompaniesHousePSCItem = {
  name?: string;
  nationality?: string;
  address?: Record<string, unknown>;
};

export type CompaniesHousePSCResult = {
  items: CompaniesHousePSCItem[];
  raw: unknown;
};

function basicAuthHeader(key: string) {
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export async function fetchCompanyPSC(companyNumber: string): Promise<CompaniesHousePSCResult> {
  const url = `${BASE_URL}/company/${encodeURIComponent(companyNumber)}/persons-with-significant-control`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: basicAuthHeader(apiKey),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Companies House PSC error ${response.status}: ${text}`);
  }

  return {
    items: Array.isArray(data.items) ? (data.items as CompaniesHousePSCItem[]) : [],
    raw: data,
  };
}
