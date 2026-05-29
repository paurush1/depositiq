import { runIngestion } from "@/lib/ingestion";
import type {
  IngestionRunResult,
  NormalizedProductRecord
} from "@/lib/ingestion/types";
import { hasSupabaseServerEnv, supabaseRestRequest } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const categoryNames: Record<string, string> = {
  savings: "Savings Accounts",
  "credit-cards": "Credit Cards",
  "home-loans": "Home Loans",
  "personal-loans": "Personal Loans",
  "business-loans": "Business Loans",
  other: "Other Products"
};

type StoredComparisonProduct = {
  id: string;
  institution_id: string;
  institution_name: string;
  category: string;
  category_name: string;
  name: string;
  summary: string;
  rate_label: string;
  monthly_fee_label: string;
  monthly_fee_value: number | null;
  has_intro_offer: boolean;
  has_offset: boolean;
  has_rewards: boolean;
  eligibility: string;
  features: string[];
  reasons: string[];
  last_updated: string;
  source_kind: string;
  application_url: string | null;
  source_snapshots: unknown[];
  score: number;
  synced_at: string;
};

export async function syncComparisonCatalog(options?: {
  brandQuery?: string;
  limit?: number;
}) {
  if (!hasSupabaseServerEnv()) {
    throw new Error(
      "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first."
    );
  }

  const runs = await runIngestion({
    useFixtureData: false,
    liveRegisterDiscovery: true,
    brandQuery: options?.brandQuery,
    limit: options?.limit ?? 2
  });
  const records = runs
    .filter((run) => !run.error)
    .flatMap((run) => run.products)
    .map(mapNormalizedProductToStoredRecord);

  if (records.length > 0) {
    await supabaseRestRequest<void>({
      path: "comparison_products",
      method: "POST",
      query: {
        on_conflict: "id"
      },
      body: records,
      prefer: "resolution=merge-duplicates"
    });
  }

  const warnings = runs.flatMap((run) => run.warnings);
  const errors = runs
    .filter((run) => run.error)
    .map((run) => ({
      institution: run.institution.name,
      error: run.error
    }));

  await supabaseRestRequest<void>({
    path: "ingestion_sync_runs",
    method: "POST",
    body: {
      source_label: options?.brandQuery ?? "live-register-discovery",
      institution_count: runs.length,
      product_count: records.length,
      failure_count: errors.length,
      warnings,
      errors
    }
  });

  return {
    runs,
    productCount: records.length,
    failureCount: errors.length
  };
}

export async function getStoredCompareProducts(category?: string) {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  const data = await supabaseRestRequest<StoredComparisonProduct[]>({
    path: "comparison_products",
    query: {
      select: "*",
      order: "score.desc",
      limit: 100,
      ...(category ? { category: `eq.${category}` } : {})
    }
  });

  return (data ?? []).map(mapStoredRecordToProduct);
}

export async function getStoredProductById(productId: string) {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  const data = await supabaseRestRequest<StoredComparisonProduct[]>({
    path: "comparison_products",
    query: {
      select: "*",
      id: `eq.${productId}`,
      limit: 1
    }
  });

  if (!data || data.length === 0) {
    return null;
  }

  return mapStoredRecordToProduct(data[0]);
}

export function mapNormalizedProductToStoredRecord(product: NormalizedProductRecord) {
  const monthlyFeeValue = product.monthlyFeeValue ?? 0;

  return {
    id: buildProductId(product),
    institution_id: product.institutionId,
    institution_name: product.institutionName,
    category: product.category,
    category_name: categoryNames[product.category] ?? categoryNames.other,
    name: product.name,
    summary: product.summary,
    rate_label: product.rateLabel,
    monthly_fee_label: product.monthlyFeeLabel,
    monthly_fee_value: product.monthlyFeeValue,
    has_intro_offer: product.hasIntroOffer,
    has_offset: product.hasOffset,
    has_rewards: product.hasRewards,
    eligibility: product.eligibility,
    features: product.features,
    reasons:
      product.reasons.length > 0 ? product.reasons : ["Live product imported from CDR source"],
    last_updated: product.lastUpdated,
    source_kind: product.sourceKind,
    application_url: product.applicationUrl ?? null,
    source_snapshots: product.sourceSnapshots,
    score: calculateBaseScore(product, monthlyFeeValue),
    synced_at: new Date().toISOString()
  };
}

function buildProductId(product: NormalizedProductRecord) {
  return `${product.institutionId}--${product.externalId}`;
}

function mapStoredRecordToProduct(product: StoredComparisonProduct): Product {
  return {
    id: product.id,
    bankName: product.institution_name,
    category: product.category,
    categoryName: product.category_name,
    name: product.name,
    summary: product.summary,
    rateLabel: product.rate_label,
    monthlyFeeLabel: product.monthly_fee_label,
    monthlyFeeValue: product.monthly_fee_value ?? 0,
    hasIntroOffer: product.has_intro_offer,
    hasOffset: product.has_offset,
    hasRewards: product.has_rewards,
    eligibility: product.eligibility,
    features: product.features ?? [],
    reasons: product.reasons ?? [],
    lastUpdated: product.last_updated,
    score: product.score
  };
}

function calculateBaseScore(
  product: NormalizedProductRecord,
  monthlyFeeValue: number
) {
  let score = 70;

  if (monthlyFeeValue === 0) {
    score += 8;
  } else if (monthlyFeeValue <= 10) {
    score += 4;
  }

  if (product.hasIntroOffer) {
    score += 5;
  }

  if (product.hasOffset) {
    score += 6;
  }

  if (product.hasRewards) {
    score += 5;
  }

  if (
    /pending review/i.test(product.rateLabel) ||
    /pending review/i.test(product.monthlyFeeLabel)
  ) {
    score -= 8;
  }

  return Math.max(1, Math.min(95, score));
}

export function getSyncDiagnostics(runs: IngestionRunResult[]) {
  return runs.map((run) => ({
    institution: run.institution.name,
    products: run.products.length,
    warnings: run.warnings,
    error: run.error
  }));
}
