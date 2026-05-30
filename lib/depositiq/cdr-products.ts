import {
  fallbackCompetitorRates,
  preferredCdrBrands
} from "@/lib/depositiq/fallback";
import { getCdrBrandSummaries, type CdrBrandSummary } from "@/lib/depositiq/cdr-register";
import type {
  CompetitorDepositRate,
  MarketDataMode,
  MarketDataStatus
} from "@/lib/depositiq/types";

type FetchCompetitorRatesResult = {
  rates: CompetitorDepositRate[];
  status: MarketDataStatus;
  warnings: string[];
};

type ProductCategory = "TRANS_AND_SAVINGS_ACCOUNTS" | "TERM_DEPOSITS";

type RateCandidate = {
  headlineRate: number;
  baseRate?: number;
  bonusRate?: number;
  termMonths?: number;
  minBalance?: number;
  maxBalance?: number;
  conditionsSummary?: string;
  rateType?: string;
};

const CATEGORY_MAP: Record<ProductCategory, CompetitorDepositRate["category"]> = {
  TRANS_AND_SAVINGS_ACCOUNTS: "Savings",
  TERM_DEPOSITS: "Term Deposit"
};

const PRODUCT_LIST_VERSIONS = ["4", "3"];
const PRODUCT_DETAIL_VERSIONS = ["6", "5", "4"];
const BRAND_LIMIT = 5;
const DETAIL_LIMIT_PER_CATEGORY = 4;

export async function getCompetitorDepositRates(options?: {
  fetchImpl?: typeof fetch;
  mode?: MarketDataMode;
}): Promise<FetchCompetitorRatesResult> {
  const mode = options?.mode ?? "live";
  const fetchImpl = options?.fetchImpl ?? fetch;

  if (mode === "fallback") {
    return {
      rates: fallbackCompetitorRates,
      status: "fallback",
      warnings: ["Fallback mode enabled. Live CDR calls were skipped."]
    };
  }

  try {
    const discoveredBrands = await getCdrBrandSummaries({ fetchImpl });
    const targetBrands = selectTargetBrands(discoveredBrands);
    const warnings: string[] = [];
    const liveRates = (
      await Promise.all(
        targetBrands.map(async (brand) => {
          try {
            return await fetchBrandRates(fetchImpl, brand);
          } catch (error) {
            warnings.push(
              `${brand.brandName}: ${error instanceof Error ? error.message : "Unknown CDR error"}`
            );
            return [];
          }
        })
      )
    ).flat();

    const dedupedLiveRates = dedupeRates(liveRates);

    if (dedupedLiveRates.length === 0) {
      return {
        rates: fallbackCompetitorRates,
        status: "fallback",
        warnings: [
          "No live CDR competitor rates were available. Showing fallback data.",
          ...warnings
        ]
      };
    }

    if (warnings.length > 0 || dedupedLiveRates.length < fallbackCompetitorRates.length / 2) {
      return {
        rates: dedupeRates([...dedupedLiveRates, ...fallbackCompetitorRates]).slice(0, 30),
        status: "partial",
        warnings: [
          "Partial CDR + fallback mode. Live data was combined with fallback benchmark products.",
          ...warnings
        ]
      };
    }

    return {
      rates: dedupeRates(dedupedLiveRates).slice(0, 30),
      status: "live",
      warnings
    };
  } catch (error) {
    return {
      rates: fallbackCompetitorRates,
      status: "fallback",
      warnings: [
        error instanceof Error
          ? error.message
          : "CDR market data fetch failed. Showing fallback data instead."
      ]
    };
  }
}

function selectTargetBrands(brands: CdrBrandSummary[]) {
  const preferred = brands.filter((brand) =>
    preferredCdrBrands.some((term) => brand.brandName.toLowerCase().includes(term))
  );

  return (preferred.length > 0 ? preferred : brands).slice(0, BRAND_LIMIT);
}

async function fetchBrandRates(fetchImpl: typeof fetch, brand: CdrBrandSummary) {
  const baseUri = brand.publicBaseUri?.replace(/\/$/, "");

  if (!baseUri) {
    return [];
  }

  const productIds = (
    await Promise.all(
      (["TRANS_AND_SAVINGS_ACCOUNTS", "TERM_DEPOSITS"] as ProductCategory[]).map(
        async (category) => ({
          category,
          ids: await fetchProductIds(fetchImpl, baseUri, category)
        })
      )
    )
  ).flatMap(({ category, ids }) =>
    ids.slice(0, DETAIL_LIMIT_PER_CATEGORY).map((productId) => ({ category, productId }))
  );

  const details = await Promise.all(
    productIds.map(async ({ category, productId }) => ({
      category,
      detail: await fetchProductDetail(fetchImpl, baseUri, productId)
    }))
  );

  return details.flatMap(({ category, detail }) =>
    normalizeCompetitorRates({
      brandName: brand.brandName,
      detail,
      category: CATEGORY_MAP[category]
    })
  );
}

async function fetchProductIds(
  fetchImpl: typeof fetch,
  baseUri: string,
  category: ProductCategory
): Promise<string[]> {
  const url = new URL(`${baseUri}/cds-au/v1/banking/products`);
  url.searchParams.set("product-category", category);
  url.searchParams.set("page-size", "100");

  const payload = await fetchWithVersionFallback(fetchImpl, url.toString(), PRODUCT_LIST_VERSIONS);
  const products = Array.isArray(payload?.data?.products) ? payload.data.products : [];

  return products
    .map((product: { productId?: unknown }) => product?.productId)
    .filter((productId: unknown): productId is string => typeof productId === "string");
}

async function fetchProductDetail(
  fetchImpl: typeof fetch,
  baseUri: string,
  productId: string
) {
  return fetchWithVersionFallback(
    fetchImpl,
    `${baseUri}/cds-au/v1/banking/products/${productId}`,
    PRODUCT_DETAIL_VERSIONS
  );
}

async function fetchWithVersionFallback(
  fetchImpl: typeof fetch,
  url: string,
  versions: string[]
) {
  let lastError: Error | null = null;

  for (const version of versions) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          Accept: "application/json",
          "x-v": version,
          "x-min-v": versions[versions.length - 1]
        },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} (x-v ${version})`);
      }

      return response.json();
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(`Unknown CDR error for ${url}`);
    }
  }

  throw lastError ?? new Error(`CDR request failed for ${url}`);
}

export function normalizeCompetitorRates(input: {
  brandName: string;
  detail: any;
  category: CompetitorDepositRate["category"];
}): CompetitorDepositRate[] {
  const product = input.detail?.data ?? input.detail;
  const bank = input.brandName;
  const productName = product?.name ?? product?.productName ?? "Unnamed product";
  const lastUpdated = product?.lastUpdated ?? input.detail?.meta?.lastUpdated;
  const candidates = extractRateCandidates(product);

  if (candidates.length === 0) {
    return [];
  }

  if (input.category === "Savings") {
    const best = candidates.sort((a, b) => b.headlineRate - a.headlineRate)[0];

    return [
      {
        bank,
        brandName: input.brandName,
        productName,
        category: "Savings",
        headlineRate: best.headlineRate,
        baseRate: best.baseRate,
        bonusRate: best.bonusRate,
        minBalance: best.minBalance,
        maxBalance: best.maxBalance,
        conditionsSummary:
          best.conditionsSummary ??
          "Review CDR rate tiers and eligibility.",
        rateType: best.rateType ?? "Indicative savings rate",
        lastUpdated,
        source: "CDR"
      }
    ];
  }

  return candidates.map((candidate) => ({
    bank,
    brandName: input.brandName,
    productName:
      candidate.termMonths !== undefined
        ? `${productName} ${candidate.termMonths}m`
        : productName,
    category: "Term Deposit",
    headlineRate: candidate.headlineRate,
    baseRate: candidate.baseRate,
    bonusRate: candidate.bonusRate,
    termMonths: candidate.termMonths,
    minBalance: candidate.minBalance,
    maxBalance: candidate.maxBalance,
    conditionsSummary:
      candidate.conditionsSummary ??
      "Review CDR rate tiers and eligibility.",
    rateType: candidate.rateType ?? "Fixed term",
    lastUpdated,
    source: "CDR"
  }));
}

function extractRateCandidates(product: any): RateCandidate[] {
  const depositRates = Array.isArray(product?.depositRates) ? product.depositRates : [];
  const candidates: RateCandidate[] = depositRates.flatMap((rate: any) => {
    const baseRate = parseRate(rate?.rate);
    const rateType = stringify(rate?.depositRateType) ?? stringify(rate?.rateType);
    const conditionsSummary = buildConditionsSummary(rate);
    const baseCandidate: RateCandidate | null =
      baseRate !== undefined
        ? {
            headlineRate: baseRate,
            baseRate,
            termMonths: readTermMonths(rate),
            minBalance: parseNumber(readTierMinimum(rate)),
            maxBalance: parseNumber(readTierMaximum(rate)),
            conditionsSummary,
            rateType
          }
        : null;

    const tierCandidates = (Array.isArray(rate?.tiers) ? rate.tiers : []).flatMap((tier: any) => {
      const tierRate = parseRate(tier?.rate ?? tier?.additionalValue ?? tier?.value);

      if (tierRate === undefined) {
        return [];
      }

      return [
        {
          headlineRate: tierRate,
          baseRate: isBonusRate(rateType) ? undefined : tierRate,
          bonusRate: isBonusRate(rateType) ? tierRate : undefined,
          termMonths: readTermMonths(tier) ?? readTermMonths(rate),
          minBalance: parseNumber(readTierMinimum(tier)),
          maxBalance: parseNumber(readTierMaximum(tier)),
          conditionsSummary: buildConditionsSummary(rate, tier),
          rateType
        }
      ];
    });

    return [...(baseCandidate ? [baseCandidate] : []), ...tierCandidates];
  });

  return candidates.map((candidate: RateCandidate) => ({
    ...candidate,
    bonusRate:
      candidate.bonusRate ??
      (candidate.baseRate !== undefined &&
      candidate.headlineRate > candidate.baseRate
        ? Number((candidate.headlineRate - candidate.baseRate).toFixed(2))
        : undefined)
  }));
}

function buildConditionsSummary(rate: any, tier?: any) {
  const parts = [
    stringify(rate?.additionalInfo),
    stringify(rate?.additionalValue),
    stringify(rate?.applicationFrequency),
    stringify(rate?.calculationFrequency),
    stringify(rate?.additionalInfoUri),
    stringify(rate?.eligibilityType),
    stringify(tier?.additionalInfo),
    stringify(tier?.name)
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(" • ")
    : "Review CDR rate tiers and eligibility.";
}

function readTermMonths(source: any) {
  const explicit =
    parseNumber(source?.term) ??
    parseNumber(source?.termAmount) ??
    parseNumber(source?.applicationFrequencyDetails?.term);

  if (explicit !== undefined) {
    return explicit;
  }

  const text = [
    stringify(source?.termUnitOfMeasure),
    stringify(source?.name),
    stringify(source?.additionalInfo)
  ]
    .filter(Boolean)
    .join(" ");

  const match = text.match(/(\d+)\s*(month|months|mth|mths|m)\b/i);
  return match ? Number(match[1]) : undefined;
}

function readTierMinimum(source: any) {
  return (
    source?.minimumValue ??
    source?.minValue ??
    source?.minimumAmount ??
    source?.additionalInfo
  );
}

function readTierMaximum(source: any) {
  return source?.maximumValue ?? source?.maxValue ?? source?.maximumAmount;
}

function isBonusRate(rateType?: string) {
  return Boolean(rateType && /bonus|intro|promotional/i.test(rateType));
}

function parseRate(value: unknown) {
  const parsed = parseNumber(value);
  return parsed !== undefined ? Number(parsed.toFixed(2)) : undefined;
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function stringify(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function dedupeRates(rates: CompetitorDepositRate[]) {
  const seen = new Set<string>();

  return rates.filter((rate) => {
    const key = [
      rate.brandName,
      rate.productName,
      rate.category,
      rate.termMonths ?? "",
      rate.headlineRate,
      rate.source === "CDR" ? "cdr" : "fallback"
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
