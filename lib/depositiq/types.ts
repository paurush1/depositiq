export type CompetitorDepositRate = {
  bank: string;
  brandName: string;
  productName: string;
  category: "Savings" | "Transaction" | "Term Deposit";
  headlineRate: number;
  baseRate?: number;
  bonusRate?: number;
  termMonths?: number;
  minBalance?: number;
  maxBalance?: number;
  conditionsSummary?: string;
  feesSummary?: string;
  rateType?: string;
  lastUpdated?: string;
  source: "CDR" | "Fallback";
};

export type CashRateMarketAnchor = {
  cashRateTarget: number;
  effectiveDate: string;
  source: string;
};

export type MarketDataMode = "live" | "fallback";

export type MarketDataStatus = "live" | "fallback" | "partial";

export type CompetitorPressure = "Low" | "Medium" | "High";

export type IncrementalInterestCost = "Low" | "Medium" | "High";

export type PricingScenario = {
  name: string;
  description: string;
  proposedRate: number;
  rateGapToMarketAverage: number;
  spreadToRbaCashRate: number;
  competitorPressure: CompetitorPressure;
  incrementalInterestCost: IncrementalInterestCost;
  recommendation: string;
};

export type MarketSummary = {
  marketAverageRate: number;
  highestCompetitorRate: number;
  competitorProductsAnalysed: number;
  dataSourceStatus: MarketDataStatus;
  mode: MarketDataMode;
  warnings: string[];
};

export type MarketPricingPayload = {
  cashRate: CashRateMarketAnchor;
  competitorRates: CompetitorDepositRate[];
  summary: MarketSummary;
  scenarios: PricingScenario[];
  disclaimers: string[];
  generatedAt: string;
};
