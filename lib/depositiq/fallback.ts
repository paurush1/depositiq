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
    feesSummary: "No monthly account fee on linked savings account.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-20",
    source: "Fallback"
  },
  {
    bank: "Commonwealth Bank",
    brandName: "CommBank",
    productName: "Smart Access",
    category: "Transaction",
    headlineRate: 0.05,
    baseRate: 0.05,
    conditionsSummary:
      "Everyday transaction account. Review linked savings pathways and package eligibility.",
    feesSummary: "Monthly fee may apply unless waived by package or age eligibility.",
    rateType: "Transaction base",
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
    feesSummary: "No monthly account fee for the saver product.",
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
    feesSummary: "No monthly account fee for online savings product.",
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
    feesSummary: "No monthly account fee on linked savings product.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-17",
    source: "Fallback"
  },
  {
    bank: "Macquarie",
    brandName: "Macquarie",
    productName: "Savings Account",
    category: "Savings",
    headlineRate: 4.85,
    baseRate: 4.85,
    conditionsSummary:
      "Indicative variable rate. Review onboarding offer windows, linked transaction account setup and product terms.",
    feesSummary: "No monthly account fee. Check transaction account conditions separately.",
    rateType: "Variable",
    lastUpdated: "2026-05-22",
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
    feesSummary: "No monthly account fee on savings product.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-21",
    source: "Fallback"
  },
  {
    bank: "Ubank",
    brandName: "ubank",
    productName: "Save Account",
    category: "Savings",
    headlineRate: 5.05,
    baseRate: 0.1,
    bonusRate: 4.95,
    conditionsSummary:
      "Indicative bonus rate. Review monthly deposit and balance growth conditions.",
    feesSummary: "No monthly account fee.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-22",
    source: "Fallback"
  },
  {
    bank: "AMP",
    brandName: "AMP",
    productName: "Saver Account",
    category: "Savings",
    headlineRate: 4.7,
    baseRate: 0.2,
    bonusRate: 4.5,
    conditionsSummary:
      "Indicative savings rate. Review deposit and linked account requirements.",
    feesSummary: "No monthly account fee on savings account.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-20",
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
    feesSummary: "No monthly fee. Early withdrawal restrictions may apply.",
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
    feesSummary: "No monthly fee. Early withdrawal restrictions may apply.",
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
    feesSummary: "No monthly account fee on saver. Check linked everyday account terms.",
    rateType: "Bonus variable",
    lastUpdated: "2026-05-14",
    source: "Fallback"
  },
  {
    bank: "ANZ",
    brandName: "ANZ",
    productName: "Access Advantage",
    category: "Transaction",
    headlineRate: 0,
    baseRate: 0,
    conditionsSummary:
      "Everyday transaction account. Review package waivers, eligibility and linked savings pathways.",
    feesSummary: "Monthly account fee may apply unless package or waiver criteria are met.",
    rateType: "Transaction base",
    lastUpdated: "2026-05-18",
    source: "Fallback"
  },
  {
    bank: "Westpac",
    brandName: "Westpac",
    productName: "Choice",
    category: "Transaction",
    headlineRate: 0.01,
    baseRate: 0.01,
    conditionsSummary:
      "Everyday transaction account. Review fee waivers and bundled product conditions.",
    feesSummary: "Monthly account fee may apply unless waiver conditions are met.",
    rateType: "Transaction base",
    lastUpdated: "2026-05-19",
    source: "Fallback"
  },
  {
    bank: "Macquarie",
    brandName: "Macquarie",
    productName: "Term Deposit 12 months",
    category: "Term Deposit",
    headlineRate: 4.6,
    termMonths: 12,
    minBalance: 5000,
    conditionsSummary:
      "Indicative term deposit rate. Review maturity instructions, renewal handling and break costs.",
    feesSummary: "No monthly fee. Early withdrawal restrictions may apply.",
    rateType: "Fixed term",
    lastUpdated: "2026-05-22",
    source: "Fallback"
  }
];

export const preferredCdrBrands = [
  "commbank",
  "commonwealth bank",
  "westpac",
  "anz",
  "nab",
  "macquarie",
  "ing",
  "ubank",
  "amp",
  "bendigo",
  "suncorp",
  "bank of queensland",
  "boq"
];
