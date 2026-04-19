const BASE_URL = "https://api.company-information.service.gov.uk";

// Kept as local constant by request (same approach as Wix reference files).
const apiKey = "eb3d1e89-6af3-4ffb-a899-ccbb75f222fb";

export type AdvancedCompaniesPageFilters = {
  incorporatedFrom: string;
  incorporatedTo: string;
  sicCode: string;
  size: string;
  startIndex: number;
  itemsPerPage: number;
};

export type CompaniesHouseCompany = {
  company_number: string;
  company_name: string;
  company_status?: string;
  date_of_creation?: string;
  sic_codes?: string[];
};

export type CompaniesHouseAddress = Record<string, unknown>;

export type AdvancedCompaniesPageResult = {
  items: CompaniesHouseCompany[];
  totalResults: number;
  itemsPerPage: number;
  startIndex: number;
  raw: unknown;
};

export type CompaniesHouseProfileResult = {
  companyNumber: string;
  registeredOfficeAddress: CompaniesHouseAddress;
  raw: unknown;
};

function basicAuthHeader(key: string) {
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

function toQueryString(filters: AdvancedCompaniesPageFilters) {
  const qs = new URLSearchParams();
  qs.append("incorporated_from", filters.incorporatedFrom);
  qs.append("incorporated_to", filters.incorporatedTo);
  qs.append("sic_codes", filters.sicCode);
  qs.append("size", filters.size);
  qs.append("start_index", String(filters.startIndex));
  qs.append("items_per_page", String(filters.itemsPerPage));
  return qs.toString();
}

export async function fetchAdvancedCompaniesPage(
  filters: AdvancedCompaniesPageFilters
): Promise<AdvancedCompaniesPageResult> {
  const url = `${BASE_URL}/advanced-search/companies?${toQueryString(filters)}`;
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
    throw new Error(`Companies House advanced-search error ${response.status}: ${text}`);
  }

  const items = Array.isArray(data.items) ? (data.items as CompaniesHouseCompany[]) : [];
  const totalResultsRaw =
    typeof data.total_results === "number"
      ? data.total_results
      : typeof data.hits === "number"
        ? data.hits
        : items.length;

  return {
    items,
    totalResults: totalResultsRaw,
    itemsPerPage:
      typeof data.items_per_page === "number" ? data.items_per_page : filters.itemsPerPage,
    startIndex:
      typeof data.start_index === "number" ? data.start_index : filters.startIndex,
    raw: data,
  };
}

export async function fetchCompanyProfile(
  companyNumber: string
): Promise<CompaniesHouseProfileResult> {
  const url = `${BASE_URL}/company/${encodeURIComponent(companyNumber)}`;
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
    throw new Error(`Companies House company-profile error ${response.status}: ${text}`);
  }

  return {
    companyNumber,
    registeredOfficeAddress:
      data.registered_office_address && typeof data.registered_office_address === "object"
        ? (data.registered_office_address as CompaniesHouseAddress)
        : {},
    raw: data,
  };
}
