export type SourceKind = "cdr" | "website";

export type InstitutionConfig = {
  id: string;
  name: string;
  kind: SourceKind;
  cdrBaseUrl?: string;
  websiteUrl?: string;
  brand?: string;
  selectors?: WebsiteSelectors;
};

export type WebsiteSelectors = {
  productCard: string;
  name: string;
  summary?: string;
  rate?: string;
  fee?: string;
  link?: string;
};

export type CdrProductSummary = {
  productId: string;
  name: string;
  description?: string;
  brand?: string;
  brandName?: string;
  productCategory?: string;
  isTailored?: boolean;
  lastUpdated?: string;
  applicationUri?: string;
};

export type CdrProductDetail = CdrProductSummary & {
  bundles?: Array<{ name?: string; description?: string }>;
  features?: Array<{ title?: string; description?: string }>;
  constraints?: Array<{ type?: string; displayValue?: string }>;
  depositRates?: Array<{
    depositRateType?: string;
    rate?: string;
    additionalInfo?: string;
  }>;
  lendingRates?: Array<{
    lendingRateType?: string;
    rate?: string;
    additionalInfo?: string;
  }>;
  fees?: Array<{
    name?: string;
    feeAmount?: string;
    feeType?: string;
    additionalInfo?: string;
  }>;
  eligibility?: Array<{
    eligibilityType?: string;
    additionalInfo?: string;
  }>;
};

export type CdrProductListResponse = {
  data: {
    products: CdrProductSummary[];
  };
  links?: {
    next?: string;
  };
  meta?: {
    totalRecords?: number;
    totalPages?: number;
  };
};

export type CdrProductDetailResponse = {
  data: CdrProductDetail;
};

export type RawSourceSnapshot = {
  institutionId: string;
  sourceKind: SourceKind;
  fetchedAt: string;
  sourceUrl: string;
  payload: unknown;
};

export type NormalizedProductRecord = {
  externalId: string;
  institutionId: string;
  institutionName: string;
  sourceKind: SourceKind;
  category: string;
  name: string;
  summary: string;
  rateLabel: string;
  monthlyFeeLabel: string;
  monthlyFeeValue: number | null;
  hasIntroOffer: boolean;
  hasOffset: boolean;
  hasRewards: boolean;
  eligibility: string;
  applicationUrl?: string;
  features: string[];
  reasons: string[];
  lastUpdated: string;
  sourceSnapshots: RawSourceSnapshot[];
};

export type IngestionRunResult = {
  institution: InstitutionConfig;
  products: NormalizedProductRecord[];
  snapshots: RawSourceSnapshot[];
  warnings: string[];
  error?: string;
};
