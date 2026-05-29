import type { CompetitorDepositRate, MarketPricingPayload } from "@/lib/depositiq/types";

export const productModules = [
  {
    href: "/",
    label: "Overview",
    shortDescription: "Portfolio view across market, customer and prioritisation signals."
  },
  {
    href: "/market-intelligence",
    label: "Market Intelligence",
    shortDescription: "Scan public competitor rates and market context."
  },
  {
    href: "/pricing-simulator",
    label: "Pricing Simulator",
    shortDescription: "Model balance, churn and funding trade-offs."
  },
  {
    href: "/product-complexity",
    label: "Product Complexity",
    shortDescription: "Measure conditionality and comprehension risk."
  },
  {
    href: "/primary-banking",
    label: "Primary Banking",
    shortDescription: "Track primacy and next-best-action levers."
  },
  {
    href: "/customer-friction",
    label: "Customer Friction",
    shortDescription: "Classify operational pain points and themes."
  },
  {
    href: "/prioritisation",
    label: "Prioritisation",
    shortDescription: "Re-rank the roadmap with adjustable decision weights."
  }
] as const;

export type ComplexityRisk = "Low" | "Medium" | "High";

export type CompetitorRateWithComplexity = CompetitorDepositRate & {
  simplicityScore: number;
  conditionalityScore: number;
  comprehensionRisk: ComplexityRisk;
};

export type SyntheticCustomer = {
  id: string;
  name: string;
  segment: "Mass market" | "Affluent" | "Digital first" | "Young saver";
  salaryCredit: boolean;
  payIdRegistered: boolean;
  walletProvisioned: boolean;
  cardUsagePerMonth: number;
  recurringPayments: number;
  directDebits: number;
  averageBalance: number;
};

export type PrimaryRelationshipBand =
  | "Primary relationship"
  | "Emerging primary"
  | "Secondary relationship"
  | "Rate chaser / low engagement";

export type CustomerWithScore = SyntheticCustomer & {
  primaryBankingScore: number;
  relationshipBand: PrimaryRelationshipBand;
  nextBestAction: string;
};

export type FeedbackTheme =
  | "PayID setup"
  | "Card dispute status"
  | "Savings rate confusion"
  | "Term deposit maturity"
  | "Digital wallet activation"
  | "Transaction notifications"
  | "General servicing";

export type FeedbackItem = {
  id: string;
  comment: string;
  theme: FeedbackTheme;
  severity: "Low" | "Medium" | "High";
  channel: "App review" | "Call centre" | "Complaint" | "Survey";
  journeyStage: "Onboarding" | "Everyday use" | "Servicing" | "Maturity";
  owner: "Deposits" | "Payments" | "Operations" | "Digital servicing";
  recommendedAction: string;
  metricToTrack: string;
  severityWeight: number;
};

export type Initiative = {
  id: string;
  name: string;
  commercialValue: number;
  customerValue: number;
  riskReduction: number;
  strategicFit: number;
  marketPressure: number;
  primacyUplift: number;
  effort: number;
  dependencyComplexity: number;
  regulatoryUrgency: number;
  whyNow: string;
  expectedMetricImpact: string;
  keyStakeholders: string;
  deliveryRisk: string;
  suggestedExperiment: string;
};

export type PrioritisationWeights = {
  commercialValue: number;
  customerValue: number;
  riskReduction: number;
  strategicFit: number;
  marketPressure: number;
  primacyUplift: number;
  effortPenalty: number;
  dependencyPenalty: number;
};

export const defaultPrioritisationWeights: PrioritisationWeights = {
  commercialValue: 1.2,
  customerValue: 1,
  riskReduction: 0.9,
  strategicFit: 0.8,
  marketPressure: 1,
  primacyUplift: 0.8,
  effortPenalty: 0.7,
  dependencyPenalty: 0.6
};

export const customerSegments = [
  "Mass market",
  "Affluent",
  "Digital first",
  "Young saver",
  "Small business"
] as const;

export const syntheticCustomers: SyntheticCustomer[] = [
  {
    id: "C-1001",
    name: "Ava Chen",
    segment: "Young saver",
    salaryCredit: false,
    payIdRegistered: true,
    walletProvisioned: true,
    cardUsagePerMonth: 14,
    recurringPayments: 2,
    directDebits: 1,
    averageBalance: 4200
  },
  {
    id: "C-1002",
    name: "Liam Carter",
    segment: "Mass market",
    salaryCredit: true,
    payIdRegistered: true,
    walletProvisioned: false,
    cardUsagePerMonth: 24,
    recurringPayments: 4,
    directDebits: 3,
    averageBalance: 9800
  },
  {
    id: "C-1003",
    name: "Mia Patel",
    segment: "Digital first",
    salaryCredit: false,
    payIdRegistered: false,
    walletProvisioned: true,
    cardUsagePerMonth: 6,
    recurringPayments: 1,
    directDebits: 0,
    averageBalance: 2600
  },
  {
    id: "C-1004",
    name: "Noah Singh",
    segment: "Affluent",
    salaryCredit: true,
    payIdRegistered: true,
    walletProvisioned: true,
    cardUsagePerMonth: 31,
    recurringPayments: 5,
    directDebits: 5,
    averageBalance: 25500
  },
  {
    id: "C-1005",
    name: "Isla Morgan",
    segment: "Mass market",
    salaryCredit: true,
    payIdRegistered: false,
    walletProvisioned: false,
    cardUsagePerMonth: 10,
    recurringPayments: 2,
    directDebits: 2,
    averageBalance: 7500
  },
  {
    id: "C-1006",
    name: "Zoe Ramirez",
    segment: "Digital first",
    salaryCredit: false,
    payIdRegistered: true,
    walletProvisioned: false,
    cardUsagePerMonth: 9,
    recurringPayments: 1,
    directDebits: 1,
    averageBalance: 3100
  },
  {
    id: "C-1007",
    name: "Arjun Bell",
    segment: "Affluent",
    salaryCredit: true,
    payIdRegistered: true,
    walletProvisioned: true,
    cardUsagePerMonth: 22,
    recurringPayments: 6,
    directDebits: 4,
    averageBalance: 18700
  },
  {
    id: "C-1008",
    name: "Emily Foster",
    segment: "Young saver",
    salaryCredit: false,
    payIdRegistered: false,
    walletProvisioned: false,
    cardUsagePerMonth: 3,
    recurringPayments: 0,
    directDebits: 0,
    averageBalance: 1800
  }
];

export const baseFeedbackItems: FeedbackItem[] = [
  {
    id: "F-01",
    comment: "Rate bonus is too hard to understand and I never know if I qualified.",
    theme: "Savings rate confusion",
    severity: "Medium",
    channel: "Complaint",
    journeyStage: "Everyday use",
    owner: "Deposits",
    recommendedAction: "Simplify qualification messaging and show progress tracker.",
    metricToTrack: "Bonus rate qualification rate",
    severityWeight: 6
  },
  {
    id: "F-02",
    comment: "PayID registration kept failing during setup.",
    theme: "PayID setup",
    severity: "High",
    channel: "Call centre",
    journeyStage: "Onboarding",
    owner: "Payments",
    recommendedAction: "Fix validation issues and improve onboarding prompts.",
    metricToTrack: "PayID completion rate",
    severityWeight: 9
  },
  {
    id: "F-03",
    comment: "I cannot see where my dispute is up to after raising a chargeback.",
    theme: "Card dispute status",
    severity: "High",
    channel: "Complaint",
    journeyStage: "Servicing",
    owner: "Operations",
    recommendedAction: "Expose dispute status tracking in-app and via notifications.",
    metricToTrack: "Dispute status self-service rate",
    severityWeight: 9
  },
  {
    id: "F-04",
    comment: "The term deposit maturity process was confusing and I missed my options.",
    theme: "Term deposit maturity",
    severity: "Medium",
    channel: "Survey",
    journeyStage: "Maturity",
    owner: "Deposits",
    recommendedAction: "Redesign maturity journey and improve reminders.",
    metricToTrack: "Maturity instruction completion",
    severityWeight: 6
  },
  {
    id: "F-05",
    comment: "Apple Pay would not activate even though my card is eligible.",
    theme: "Digital wallet activation",
    severity: "Medium",
    channel: "App review",
    journeyStage: "Onboarding",
    owner: "Payments",
    recommendedAction: "Tighten wallet provisioning checks and support content.",
    metricToTrack: "Wallet activation completion rate",
    severityWeight: 6
  }
];

export const initiatives: Initiative[] = [
  {
    id: "I-01",
    name: "Simplify savings rate communication",
    commercialValue: 8,
    customerValue: 9,
    riskReduction: 7,
    strategicFit: 9,
    marketPressure: 7,
    primacyUplift: 6,
    effort: 4,
    dependencyComplexity: 3,
    regulatoryUrgency: 5,
    whyNow: "High complaint volume and pricing complexity are eroding trust.",
    expectedMetricImpact: "Higher bonus qualification clarity and lower complaint rate.",
    keyStakeholders: "Deposits, Digital, Risk, Compliance",
    deliveryRisk: "Medium",
    suggestedExperiment: "Prototype a simplified rate explainer and progress tracker."
  },
  {
    id: "I-02",
    name: "Improve PayID onboarding",
    commercialValue: 6,
    customerValue: 8,
    riskReduction: 6,
    strategicFit: 8,
    marketPressure: 5,
    primacyUplift: 9,
    effort: 5,
    dependencyComplexity: 4,
    regulatoryUrgency: 4,
    whyNow: "PayID adoption is a direct primacy lever for everyday payments behaviour.",
    expectedMetricImpact: "Higher PayID registration and lower onboarding drop-off.",
    keyStakeholders: "Payments, Operations, Distribution",
    deliveryRisk: "Medium",
    suggestedExperiment: "Test simplified PayID setup flow with proactive nudges."
  },
  {
    id: "I-03",
    name: "Add card dispute status tracking",
    commercialValue: 5,
    customerValue: 8,
    riskReduction: 8,
    strategicFit: 7,
    marketPressure: 4,
    primacyUplift: 5,
    effort: 6,
    dependencyComplexity: 6,
    regulatoryUrgency: 7,
    whyNow: "Dispute servicing is a pain point with conduct and trust implications.",
    expectedMetricImpact: "Lower dispute call volume and better complaint resolution satisfaction.",
    keyStakeholders: "Operations, Payments, Risk",
    deliveryRisk: "High",
    suggestedExperiment: "Pilot status-tracking updates for one dispute queue."
  },
  {
    id: "I-04",
    name: "Redesign term deposit maturity journey",
    commercialValue: 7,
    customerValue: 8,
    riskReduction: 7,
    strategicFit: 8,
    marketPressure: 6,
    primacyUplift: 4,
    effort: 5,
    dependencyComplexity: 5,
    regulatoryUrgency: 6,
    whyNow: "Maturity journeys influence retention and fair customer outcomes.",
    expectedMetricImpact: "Higher maturity instruction completion and lower attrition at rollover.",
    keyStakeholders: "Deposits, Operations, Treasury",
    deliveryRisk: "Medium",
    suggestedExperiment: "Trial a guided maturity experience for upcoming cohorts."
  },
  {
    id: "I-05",
    name: "Launch wallet activation campaign",
    commercialValue: 5,
    customerValue: 7,
    riskReduction: 4,
    strategicFit: 7,
    marketPressure: 5,
    primacyUplift: 8,
    effort: 3,
    dependencyComplexity: 2,
    regulatoryUrgency: 2,
    whyNow: "Wallet usage is a low-friction primacy and engagement lever.",
    expectedMetricImpact: "Higher tokenised card activation and transaction share of wallet.",
    keyStakeholders: "Payments, Marketing, Distribution",
    deliveryRisk: "Low",
    suggestedExperiment: "Target a low-wallet cohort with in-app activation prompts."
  },
  {
    id: "I-06",
    name: "Target high-balance retention offer",
    commercialValue: 9,
    customerValue: 6,
    riskReduction: 5,
    strategicFit: 7,
    marketPressure: 8,
    primacyUplift: 5,
    effort: 4,
    dependencyComplexity: 5,
    regulatoryUrgency: 3,
    whyNow: "High-balance churn risk rises when competitor rates move sharply.",
    expectedMetricImpact: "Better balance retention in price-sensitive cohorts.",
    keyStakeholders: "Deposits, Treasury, Finance, Risk",
    deliveryRisk: "Medium",
    suggestedExperiment: "Run a narrow retention offer with clear segment guardrails."
  },
  {
    id: "I-07",
    name: "Build rate movement alerting",
    commercialValue: 7,
    customerValue: 5,
    riskReduction: 6,
    strategicFit: 9,
    marketPressure: 9,
    primacyUplift: 3,
    effort: 4,
    dependencyComplexity: 4,
    regulatoryUrgency: 4,
    whyNow: "Pricing teams need faster competitor movement visibility.",
    expectedMetricImpact: "Faster pricing response times and better governance packs.",
    keyStakeholders: "Deposits, Treasury, Product",
    deliveryRisk: "Low",
    suggestedExperiment: "Ship alerts for major rate changes with manual review workflow."
  },
  {
    id: "I-08",
    name: "Create vendor incident dashboard",
    commercialValue: 4,
    customerValue: 5,
    riskReduction: 7,
    strategicFit: 6,
    marketPressure: 3,
    primacyUplift: 2,
    effort: 6,
    dependencyComplexity: 6,
    regulatoryUrgency: 5,
    whyNow: "Operational resilience is increasingly visible in customer outcomes.",
    expectedMetricImpact: "Faster incident triage and better operational reporting.",
    keyStakeholders: "Technology, Operations, Risk",
    deliveryRisk: "High",
    suggestedExperiment: "Create an MVP incident view across key external vendors."
  },
  {
    id: "I-09",
    name: "Improve recurring payment setup",
    commercialValue: 6,
    customerValue: 8,
    riskReduction: 5,
    strategicFit: 8,
    marketPressure: 4,
    primacyUplift: 8,
    effort: 5,
    dependencyComplexity: 4,
    regulatoryUrgency: 3,
    whyNow: "Recurring payment migration is a strong primacy signal and a friction hotspot.",
    expectedMetricImpact: "More recurring payments per active customer and lower churn.",
    keyStakeholders: "Payments, Digital, Distribution",
    deliveryRisk: "Medium",
    suggestedExperiment: "Test a guided recurring-payment switch assistant."
  },
  {
    id: "I-10",
    name: "Add product complexity monitoring",
    commercialValue: 6,
    customerValue: 7,
    riskReduction: 8,
    strategicFit: 8,
    marketPressure: 6,
    primacyUplift: 4,
    effort: 4,
    dependencyComplexity: 3,
    regulatoryUrgency: 6,
    whyNow: "Complexity drift can undermine pricing, trust and conduct outcomes.",
    expectedMetricImpact: "Improved visibility into product clarity and conditionality risk.",
    keyStakeholders: "Deposits, Product, Risk, Compliance",
    deliveryRisk: "Low",
    suggestedExperiment: "Start a monthly complexity scan across flagship products."
  }
];

export function getMarketStatusLabel(status: MarketPricingPayload["summary"]["dataSourceStatus"]) {
  if (status === "live") {
    return "Live CDR";
  }

  if (status === "partial") {
    return "Partial";
  }

  return "Fallback";
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

export function median(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(2))
    : sorted[middle];
}

export function analyseCompetitorRates(
  rates: CompetitorDepositRate[]
): CompetitorRateWithComplexity[] {
  return rates.map((rate) => {
    const text = `${rate.rateType ?? ""} ${rate.conditionsSummary ?? ""}`.toLowerCase();
    const bonus = /bonus|qualif|deposit requirement|monthly activity|monthly deposit/.test(text);
    const intro = /intro|promotional/.test(text);
    const tier = /tier|threshold|balance/.test(text) || rate.minBalance !== undefined || rate.maxBalance !== undefined;
    const linked = /linked|transaction account|everyday account/.test(text);
    const eligibility = /eligib|age|new customer/.test(text);
    const withdrawal = /withdraw|break cost|maturity/.test(text);
    const fee = /fee/.test(text);
    const termStructure = rate.termMonths !== undefined;

    const penalties = [
      bonus ? 18 : 0,
      intro ? 12 : 0,
      tier ? 14 : 0,
      linked ? 10 : 0,
      eligibility ? 9 : 0,
      withdrawal ? 10 : 0,
      fee ? 8 : 0,
      termStructure ? 7 : 0
    ];

    const conditionalityScore = Math.min(
      100,
      penalties.reduce((sum, value) => sum + value, 0)
    );
    const simplicityScore = Math.max(12, 100 - conditionalityScore);
    const comprehensionRisk: ComplexityRisk =
      simplicityScore < 45 ? "High" : simplicityScore < 70 ? "Medium" : "Low";

    return {
      ...rate,
      simplicityScore,
      conditionalityScore,
      comprehensionRisk
    };
  });
}

export function scorePrimaryBanking(customer: SyntheticCustomer): CustomerWithScore {
  let score = 0;

  if (customer.salaryCredit) score += 30;
  if (customer.payIdRegistered) score += 14;
  if (customer.walletProvisioned) score += 12;
  score += Math.min(20, customer.cardUsagePerMonth * 0.8);
  score += Math.min(12, customer.recurringPayments * 2.5);
  score += Math.min(10, customer.directDebits * 2);
  score += Math.min(8, customer.averageBalance / 4000);

  const primaryBankingScore = Math.round(Math.min(100, score));
  const relationshipBand: PrimaryRelationshipBand =
    primaryBankingScore >= 75
      ? "Primary relationship"
      : primaryBankingScore >= 55
        ? "Emerging primary"
        : primaryBankingScore >= 35
          ? "Secondary relationship"
          : "Rate chaser / low engagement";

  const nextBestAction = getNextBestAction(customer);

  return {
    ...customer,
    primaryBankingScore,
    relationshipBand,
    nextBestAction
  };
}

export function getNextBestAction(customer: SyntheticCustomer) {
  if (!customer.salaryCredit) {
    return "Prompt salary credit setup";
  }
  if (!customer.payIdRegistered) {
    return "Prompt PayID registration";
  }
  if (!customer.walletProvisioned) {
    return "Promote wallet activation";
  }
  if (customer.cardUsagePerMonth < 8) {
    return "Encourage everyday card use";
  }
  if (customer.directDebits + customer.recurringPayments < 3) {
    return "Help move recurring payments";
  }

  return "Deepen savings and payments engagement";
}

export function classifyFeedback(comment: string): Omit<FeedbackItem, "id" | "comment"> {
  const lower = comment.toLowerCase();

  if (lower.includes("payid")) {
    return {
      theme: "PayID setup",
      severity: "Medium",
      channel: "Survey",
      journeyStage: "Onboarding",
      owner: "Payments",
      recommendedAction: "Review setup flow, validation and error messaging.",
      metricToTrack: "PayID completion rate",
      severityWeight: 6
    };
  }
  if (lower.includes("dispute") || lower.includes("chargeback")) {
    return {
      theme: "Card dispute status",
      severity: "High",
      channel: "Complaint",
      journeyStage: "Servicing",
      owner: "Operations",
      recommendedAction: "Expose dispute status and expected timeframes.",
      metricToTrack: "Dispute self-service rate",
      severityWeight: 9
    };
  }
  if (lower.includes("rate") || lower.includes("bonus")) {
    return {
      theme: "Savings rate confusion",
      severity: "Medium",
      channel: "Survey",
      journeyStage: "Everyday use",
      owner: "Deposits",
      recommendedAction: "Simplify rate qualification messaging and alerts.",
      metricToTrack: "Bonus qualification clarity score",
      severityWeight: 6
    };
  }
  if (lower.includes("term deposit") || lower.includes("maturity")) {
    return {
      theme: "Term deposit maturity",
      severity: "Medium",
      channel: "Complaint",
      journeyStage: "Maturity",
      owner: "Deposits",
      recommendedAction: "Improve maturity reminders and self-service instructions.",
      metricToTrack: "Maturity instruction completion",
      severityWeight: 6
    };
  }
  if (
    lower.includes("wallet") ||
    lower.includes("apple pay") ||
    lower.includes("google pay")
  ) {
    return {
      theme: "Digital wallet activation",
      severity: "Medium",
      channel: "App review",
      journeyStage: "Onboarding",
      owner: "Payments",
      recommendedAction: "Tighten token provisioning and troubleshooting content.",
      metricToTrack: "Wallet activation completion rate",
      severityWeight: 6
    };
  }
  if (lower.includes("notification")) {
    return {
      theme: "Transaction notifications",
      severity: "Low",
      channel: "Survey",
      journeyStage: "Everyday use",
      owner: "Digital servicing",
      recommendedAction: "Review notification logic and preference controls.",
      metricToTrack: "Notification opt-in rate",
      severityWeight: 3
    };
  }

  return {
    theme: "General servicing",
    severity: "Low",
    channel: "Survey",
    journeyStage: "Servicing",
    owner: "Digital servicing",
    recommendedAction: "Triage feedback and assign to the relevant journey owner.",
    metricToTrack: "Open general servicing themes",
    severityWeight: 3
  };
}

export function rankInitiatives(weights: PrioritisationWeights) {
  return initiatives
    .map((initiative) => {
      const score =
        initiative.commercialValue * weights.commercialValue +
        initiative.customerValue * weights.customerValue +
        initiative.riskReduction * weights.riskReduction +
        initiative.strategicFit * weights.strategicFit +
        initiative.marketPressure * weights.marketPressure +
        initiative.primacyUplift * weights.primacyUplift +
        initiative.regulatoryUrgency * 0.5 -
        initiative.effort * weights.effortPenalty -
        initiative.dependencyComplexity * weights.dependencyPenalty;

      return {
        ...initiative,
        priorityScore: Number(score.toFixed(2))
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
