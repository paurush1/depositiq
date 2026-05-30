export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type ExecutiveContact = {
  name: string;
  title: string;
  whyTheyMatter: string;
};

export type Product = {
  id: string;
  bankName: string;
  category: string;
  categoryName: string;
  name: string;
  summary: string;
  rateLabel: string;
  monthlyFeeLabel: string;
  monthlyFeeValue: number;
  hasIntroOffer: boolean;
  hasOffset: boolean;
  hasRewards: boolean;
  eligibility: string;
  features: string[];
  reasons: string[];
  lastUpdated: string;
  score: number;
  outreachAngles?: string[];
  proofPoints?: string[];
  searchSignals?: string[];
  executiveTargets?: ExecutiveContact[];
  nextStep?: string;
};

export type RankingPreferences = {
  feePreference: string;
  introRate: boolean;
  offset: boolean;
  rewards: boolean;
};

export type ScoreContribution = {
  label: string;
  impact: number;
};

export type RankedProduct = Product & {
  matchSummary: string;
  scoreBreakdown: ScoreContribution[];
};
