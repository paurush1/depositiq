import type { CompetitorDepositRate } from "@/lib/depositiq/types";

export const fallbackCashRate = {
  cashRateTarget: 4.35,
  effectiveDate: "2026-05-06",
  source: "RBA fallback"
} as const;

export const fallbackCompetitorRates: CompetitorDepositRate[] = [
  {
    bank: "Commonwealth Bank",
    brandName: "CommBank",
    productName: "GoalSaver",
    category: "Savings",
    headlineRate: 4.9,
    baseRate: 0.4,
    bonusRate: 4.5,
    conditionsSummary:
      "Indicative bonus rate. Review balance growth, deposit requirements and product terms.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-20",
    source: "Fallback"
  },
  {
    bank: "Westpac",
    brandName: "Westpac",
    productName: "Life",
    category: "Savings",
    headlineRate: 5,
    baseRate: 0.45,
    bonusRate: 4.55,
    conditionsSummary:
      "Indicative bonus rate. Review age eligibility, monthly activity and balance conditions.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-19",
    source: "Fallback"
  },
  {
    bank: "ANZ",
    brandName: "ANZ",
    productName: "Online Saver",
    category: "Savings",
    headlineRate: 4.65,
    baseRate: 0.5,
    bonusRate: 4.15,
    conditionsSummary:
      "Indicative savings rate. Review intro period, eligibility and any linked account requirements.",
    rateType: "Intro + base",
    lastUpdated: "2026-05-18",
    source: "Fallback"
  },
  {
    bank: "NAB",
    brandName: "NAB",
    productName: "Reward Saver",
    category: "Savings",
    headlineRate: 4.75,
    baseRate: 0.35,
    bonusRate: 4.4,
    conditionsSummary:
      "Indicative bonus rate. Review monthly deposit rules and withdrawal conditions.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-17",
    source: "Fallback"
  },
  {
    bank: "ING",
    brandName: "ING",
    productName: "Savings Maximiser",
    category: "Savings",
    headlineRate: 5.1,
    baseRate: 0.55,
    bonusRate: 4.55,
    conditionsSummary:
      "Indicative bonus rate. Review monthly deposit, transaction and balance thresholds.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-21",
    source: "Fallback"
  },
  {
    bank: "Bendigo Bank",
    brandName: "Bendigo Bank",
    productName: "Term Deposit 6 months",
    category: "Term Deposit",
    headlineRate: 4.35,
    termMonths: 6,
    minBalance: 5000,
    conditionsSummary:
      "Indicative term deposit rate. Review minimum balance, renewal treatment and break costs.",
    rateType: "Fixed term",
    lastUpdated: "2026-05-16",
    source: "Fallback"
  },
  {
    bank: "Suncorp Bank",
    brandName: "Suncorp Bank",
    productName: "Term Deposit 12 months",
    category: "Term Deposit",
    headlineRate: 4.55,
    termMonths: 12,
    minBalance: 1000,
    conditionsSummary:
      "Indicative term deposit rate. Review maturity instructions and early withdrawal constraints.",
    rateType: "Fixed term",
    lastUpdated: "2026-05-15",
    source: "Fallback"
  },
  {
    bank: "Bank of Queensland",
    brandName: "BOQ",
    productName: "Simple Saver",
    category: "Savings",
    headlineRate: 4.6,
    baseRate: 0.5,
    bonusRate: 4.1,
    conditionsSummary:
      "Indicative savings rate. Review linked account setup, bonus mechanics and balance tiers.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-14",
    source: "Fallback"
  }
];

export const preferredCdrBrands = [
  "commbank",
  "commonwealth bank",
  "westpac",
  "anz",
  "nab",
  "ing",
  "bendigo",
  "suncorp",
  "bank of queensland",
  "boq"
];
