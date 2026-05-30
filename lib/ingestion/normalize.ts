import type {
  CdrProductDetail,
  InstitutionConfig,
  NormalizedProductRecord,
  RawSourceSnapshot
} from "@/lib/ingestion/types";

const categoryMap: Record<string, string> = {
  TRANS_AND_SAVINGS_ACCOUNTS: "savings",
  TERM_DEPOSITS: "savings",
  CRED_AND_CHRG_CARDS: "credit-cards",
  RESIDENTIAL_MORTGAGES: "home-loans",
  PERS_LOANS: "personal-loans",
  BUSINESS_LOANS: "business-loans"
};

export function normalizeCdrProduct(
  institution: InstitutionConfig,
  detail: CdrProductDetail,
  snapshots: RawSourceSnapshot[]
): NormalizedProductRecord {
  const depositRate = detail.depositRates?.[0];
  const lendingRate = detail.lendingRates?.[0];
  const fee = detail.fees?.find((item) => item.feeType === "PERIODIC") ?? detail.fees?.[0];
  const featureTexts = (detail.features ?? [])
    .map((feature) => [feature.title, feature.description].filter(Boolean).join(": "))
    .filter(Boolean);
  const eligibility = (detail.eligibility ?? [])
    .map((item) => item.additionalInfo)
    .filter(Boolean)
    .join(" ");

  const rateLabel = depositRate
    ? `${depositRate.rate}% p.a. ${formatRateType(depositRate.depositRateType)}`
    : lendingRate
      ? `${lendingRate.rate}% p.a. ${formatRateType(lendingRate.lendingRateType)}`
      : "Rate pending review";

  const monthlyFeeValue = parseDecimal(fee?.feeAmount);

  return {
    externalId: detail.productId,
    institutionId: institution.id,
    institutionName: institution.name,
    sourceKind: "cdr",
    category: categoryMap[detail.productCategory ?? ""] ?? "other",
    name: detail.name,
    summary: detail.description ?? "Public product details imported from CDR reference data.",
    rateLabel,
    monthlyFeeLabel:
      monthlyFeeValue === null ? "Fee pending review" : `$${monthlyFeeValue.toFixed(2)}`,
    monthlyFeeValue,
    hasIntroOffer: includesAny(detail, ["intro", "promotional", "bonus"]),
    hasOffset: includesAny(detail, ["offset"]),
    hasRewards: includesAny(detail, ["reward", "point", "cashback"]),
    eligibility: eligibility || "Eligibility conditions are listed in the source detail.",
    applicationUrl: detail.applicationUri,
    features: featureTexts.length > 0 ? featureTexts : ["Feature review required"],
    reasons: buildReasons(detail, monthlyFeeValue, featureTexts),
    lastUpdated: formatDate(detail.lastUpdated),
    sourceSnapshots: snapshots
  };
}

export function normalizeWebsiteProduct(args: {
  institution: InstitutionConfig;
  externalId: string;
  name: string;
  summary: string;
  rateLabel: string;
  feeLabel: string;
  applicationUrl?: string;
  snapshots: RawSourceSnapshot[];
}): NormalizedProductRecord {
  const feeValue = parseCurrency(args.feeLabel);

  return {
    externalId: args.externalId,
    institutionId: args.institution.id,
    institutionName: args.institution.name,
    sourceKind: "website",
    category: "other",
    name: args.name,
    summary: args.summary,
    rateLabel: args.rateLabel,
    monthlyFeeLabel: args.feeLabel,
    monthlyFeeValue: feeValue,
    hasIntroOffer: /intro|promo|bonus/i.test(`${args.name} ${args.summary} ${args.rateLabel}`),
    hasOffset: /offset/i.test(`${args.name} ${args.summary}`),
    hasRewards: /reward|point|cashback/i.test(`${args.name} ${args.summary}`),
    eligibility: "Review website terms and source page for eligibility conditions.",
    applicationUrl: args.applicationUrl,
    features: ["Website-derived product summary"],
    reasons: [
      "Pulled from a public bank website",
      feeValue === 0 ? "No periodic fee detected in source text" : "Fee detected from source text"
    ],
    lastUpdated: formatDate(new Date().toISOString()),
    sourceSnapshots: args.snapshots
  };
}

function includesAny(detail: CdrProductDetail, keywords: string[]) {
  const text = [
    detail.name,
    detail.description,
    ...((detail.features ?? []).flatMap((feature) => [feature.title, feature.description])),
    ...((detail.fees ?? []).flatMap((fee) => [fee.name, fee.additionalInfo])),
    ...((detail.depositRates ?? []).map((rate) => rate.additionalInfo)),
    ...((detail.lendingRates ?? []).map((rate) => rate.additionalInfo))
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) => text.includes(keyword));
}

function buildReasons(
  detail: CdrProductDetail,
  monthlyFeeValue: number | null,
  featureTexts: string[]
) {
  const reasons = [detail.description ?? "Public product imported from CDR source"];

  if (monthlyFeeValue === 0) {
    reasons.push("No periodic fee detected in product detail");
  }

  if (featureTexts.some((feature) => /offset/i.test(feature))) {
    reasons.push("Offset-related feature detected");
  }

  if (featureTexts.some((feature) => /reward|point|cashback/i.test(feature))) {
    reasons.push("Rewards-related feature detected");
  }

  return reasons.slice(0, 3);
}

function parseDecimal(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCurrency(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatRateType(rateType?: string) {
  if (!rateType) {
    return "rate";
  }

  return rateType.toLowerCase().replaceAll("_", " ");
}

function formatDate(value?: string) {
  if (!value) {
    return "Date pending review";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}
