import type { InstitutionConfig } from "@/lib/ingestion/types";

const REGISTER_BASE_URL = "https://api.cdr.gov.au/cdr-register/v1";
const REGISTER_SUMMARY_VERSION = "2";
const REGISTER_SUMMARY_MIN_VERSION = "2";

type RegisterBrandSummary = {
  dataHolderBrandId: string;
  brandName: string;
  brandGroup?: string;
  publicBaseUri?: string;
  productBaseUri?: string;
  logoUri?: string;
  industries?: string[];
  lastUpdated?: string;
  abn?: string;
  acn?: string;
  arbn?: string;
};

type RegisterBrandsSummaryResponse = {
  data: RegisterBrandSummary[];
  links?: {
    next?: string;
  };
  meta?: {
    totalRecords?: number;
    totalPages?: number;
  };
};

export async function discoverBankingBrands(options?: {
  fetchImpl?: typeof fetch;
  brandQuery?: string;
  limit?: number;
}) {
  const fetchImpl = options?.fetchImpl ?? fetch;
  const allBrands = await fetchAllBrandSummaries(fetchImpl, "banking");
  const filtered = filterBrands(allBrands, options?.brandQuery).filter(
    (brand) => brand.productBaseUri
  );

  return filtered.slice(0, options?.limit ?? filtered.length);
}

export async function discoverInstitutionConfigs(options?: {
  fetchImpl?: typeof fetch;
  brandQuery?: string;
  limit?: number;
}): Promise<InstitutionConfig[]> {
  const brands = await discoverBankingBrands(options);

  return brands.map((brand) => ({
    id: `cdr-${brand.dataHolderBrandId}`,
    name: brand.brandName,
    kind: "cdr" as const,
    cdrBaseUrl: normalizeCdrBaseUrl(brand.productBaseUri ?? brand.publicBaseUri),
    brand: brand.brandName
  }));
}

async function fetchAllBrandSummaries(fetchImpl: typeof fetch, industry: string) {
  let nextUrl: string | null = `${REGISTER_BASE_URL}/${industry}/data-holders/brands/summary`;
  const brands: RegisterBrandSummary[] = [];

  while (nextUrl) {
    const response = await fetchImpl(nextUrl, {
      headers: {
        Accept: "application/json",
        "x-v": REGISTER_SUMMARY_VERSION,
        "x-min-v": REGISTER_SUMMARY_MIN_VERSION
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch CDR Register brand summary: ${response.status} ${response.statusText}`
      );
    }

    const page = (await response.json()) as RegisterBrandsSummaryResponse;
    brands.push(...page.data);
    nextUrl = page.links?.next ?? null;
  }

  return brands;
}

function filterBrands(brands: RegisterBrandSummary[], brandQuery?: string) {
  if (!brandQuery) {
    return brands;
  }

  const terms = brandQuery
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);

  if (terms.length === 0) {
    return brands;
  }

  return brands.filter((brand) => {
    const haystack = `${brand.brandName} ${brand.brandGroup ?? ""}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });
}

function normalizeCdrBaseUrl(uri?: string) {
  if (!uri) {
    return undefined;
  }

  const trimmed = uri.replace(/\/$/, "");

  if (/\/cds-au\/v\d+$/i.test(trimmed)) {
    return trimmed;
  }

  return `${trimmed}/cds-au/v1`;
}
