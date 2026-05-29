import { getCompetitorDepositRates } from "@/lib/depositiq/cdr-products";
import { getRbaCashRate } from "@/lib/depositiq/rba";
import type {
  CompetitorDepositRate,
  CompetitorPressure,
  IncrementalInterestCost,
  MarketDataMode,
  MarketPricingPayload,
  PricingScenario
} from "@/lib/depositiq/types";

const DISCLAIMERS = [
  "Competitor rates are indicative public product data only and require human review.",
  "Savings rates may include tiers, bonus conditions, intro periods, eligibility rules and product terms that are not fully comparable at headline level.",
  "Final pricing decisions require Product, Finance, Treasury, Risk and Compliance review."
];

export async function getMarketPricingPayload(
  mode: MarketDataMode = "live"
): Promise<MarketPricingPayload> {
  const [cashRate, competitors] = await Promise.all([
    getRbaCashRate(),
    getCompetitorDepositRates({ mode })
  ]);
  const competitorRates = competitors.rates;
  const marketAverageRate = round(
    competitorRates.reduce((sum, rate) => sum + rate.headlineRate, 0) /
      Math.max(competitorRates.length, 1)
  );
  const highestCompetitorRate = round(
    Math.max(...competitorRates.map((rate) => rate.headlineRate), 0)
  );

  return {
    cashRate,
    competitorRates,
    summary: {
      marketAverageRate,
      highestCompetitorRate,
      competitorProductsAnalysed: competitorRates.length,
      dataSourceStatus: competitors.status,
      mode,
      warnings: competitors.warnings
    },
    scenarios: buildScenarios({
      marketAverageRate,
      highestCompetitorRate,
      cashRateTarget: cashRate.cashRateTarget
    }),
    disclaimers: DISCLAIMERS,
    generatedAt: new Date().toISOString()
  };
}

function buildScenarios(input: {
  marketAverageRate: number;
  highestCompetitorRate: number;
  cashRateTarget: number;
}): PricingScenario[] {
  const scenarios = [
    {
      name: "Base case",
      description: "Maintain a disciplined reference rate while monitoring customer attrition.",
      proposedRate: Math.max(input.marketAverageRate - 0.2, input.cashRateTarget - 0.1)
    },
    {
      name: "Defensive rate increase",
      description: "Move closer to market to protect balances at portfolio level.",
      proposedRate: input.marketAverageRate + 0.1
    },
    {
      name: "Targeted promo",
      description: "Concentrate spend on acquisition or vulnerable cohorts instead of a broad repricing.",
      proposedRate: input.highestCompetitorRate + 0.05
    },
    {
      name: "Simplicity-led no-hoops offer",
      description: "Offer a cleaner headline rate with fewer hoops and a sharper customer message.",
      proposedRate: input.marketAverageRate + 0.02
    }
  ];

  return scenarios.map((scenario) => {
    const rateGapToMarketAverage = round(
      scenario.proposedRate - input.marketAverageRate
    );
    const spreadToRbaCashRate = round(
      scenario.proposedRate - input.cashRateTarget
    );
    const competitorPressure = getCompetitorPressure(rateGapToMarketAverage);
    const incrementalInterestCost = getIncrementalInterestCost(
      rateGapToMarketAverage,
      spreadToRbaCashRate
    );

    return {
      ...scenario,
      proposedRate: round(scenario.proposedRate),
      rateGapToMarketAverage,
      spreadToRbaCashRate,
      competitorPressure,
      incrementalInterestCost,
      recommendation: buildRecommendation({
        competitorPressure,
        incrementalInterestCost,
        spreadToRbaCashRate
      })
    };
  });
}

function getCompetitorPressure(rateGapToMarketAverage: number): CompetitorPressure {
  if (rateGapToMarketAverage < -0.5) {
    return "High";
  }

  if (rateGapToMarketAverage < -0.1) {
    return "Medium";
  }

  return "Low";
}

function getIncrementalInterestCost(
  rateGapToMarketAverage: number,
  spreadToRbaCashRate: number
): IncrementalInterestCost {
  if (rateGapToMarketAverage > 0.2 || spreadToRbaCashRate > 0.7) {
    return "High";
  }

  if (rateGapToMarketAverage > 0 || spreadToRbaCashRate > 0.3) {
    return "Medium";
  }

  return "Low";
}

function buildRecommendation(input: {
  competitorPressure: CompetitorPressure;
  incrementalInterestCost: IncrementalInterestCost;
  spreadToRbaCashRate: number;
}) {
  const notes: string[] = [];

  if (input.competitorPressure === "High" && input.incrementalInterestCost !== "High") {
    notes.push("Competitor pressure is elevated, so a targeted promo is the lead option.");
  } else if (
    input.competitorPressure === "High" &&
    input.incrementalInterestCost === "High"
  ) {
    notes.push(
      "Competitor pressure is elevated, but broad repricing looks expensive, so prefer a segment-level offer."
    );
  } else if (input.competitorPressure === "Low") {
    notes.push(
      "Pressure is manageable, so hold the rate and lean into primacy and customer experience."
    );
  } else {
    notes.push("Use a measured move while testing customer elasticity and campaign response.");
  }

  if (input.spreadToRbaCashRate > 0.75) {
    notes.push("Spread to the RBA cash rate is high, which flags margin pressure.");
  }

  notes.push(
    "Final pricing decisions require Product, Finance, Treasury, Risk and Compliance review."
  );

  return notes.join(" ");
}

function round(value: number) {
  return Number(value.toFixed(2));
}
