import type {
  Product,
  RankedProduct,
  RankingPreferences,
  ScoreContribution
} from "@/lib/types";

export function rankProducts(
  products: Product[],
  preferences: RankingPreferences
): RankedProduct[] {
  return [...products]
    .map((product) => calculateRankedProduct(product, preferences))
    .sort((left, right) => right.score - left.score);
}

function calculateRankedProduct(
  product: Product,
  preferences: RankingPreferences
): RankedProduct {
  let score = product.score;
  const scoreBreakdown: ScoreContribution[] = [
    {
      label: "Baseline target score",
      impact: product.score
    }
  ];

  if (preferences.feePreference === "low") {
    score -= product.monthlyFeeValue;
    scoreBreakdown.push({
      label: "Lower-friction access path preferred",
      impact: -product.monthlyFeeValue
    });
  }

  if (preferences.feePreference === "balanced") {
    scoreBreakdown.push({
      label: "Balanced target profile selected",
      impact: 0
    });
  }

  if (preferences.feePreference === "premium" && product.hasRewards) {
    score += 8;
    scoreBreakdown.push({
      label: "Scaled brand and market visibility fit your brief",
      impact: 8
    });
  }

  if (preferences.introRate && product.hasIntroOffer) {
    score += 7;
    scoreBreakdown.push({
      label: "Transformation mandate present",
      impact: 7
    });
  } else if (preferences.introRate) {
    scoreBreakdown.push({
      label: "No clear transformation trigger found",
      impact: -4
    });
    score -= 4;
  }

  if (preferences.offset && product.hasOffset) {
    score += 10;
    scoreBreakdown.push({
      label: "Regulated or platform complexity matched",
      impact: 10
    });
  } else if (preferences.offset) {
    score -= 12;
    scoreBreakdown.push({
      label: "Less complex remit than requested",
      impact: -12
    });
  }

  if (preferences.rewards && product.hasRewards) {
    score += 9;
    scoreBreakdown.push({
      label: "Consumer scale or market reach matched",
      impact: 9
    });
  } else if (preferences.rewards) {
    score -= 6;
    scoreBreakdown.push({
      label: "Lower brand reach than requested",
      impact: -6
    });
  }

  const finalScore = Math.max(1, Math.round(score));

  return {
    ...product,
    score: finalScore,
    matchSummary: buildMatchSummary(product, preferences),
    scoreBreakdown
  };
}

function buildMatchSummary(product: Product, preferences: RankingPreferences) {
  const matches: string[] = [];
  const misses: string[] = [];

  if (preferences.feePreference === "low" && product.monthlyFeeValue <= 4) {
    matches.push("an easier executive access path");
  }

  if (preferences.introRate && product.hasIntroOffer) {
    matches.push("a visible transformation mandate");
  } else if (preferences.introRate) {
    misses.push("no obvious transformation trigger");
  }

  if (preferences.offset && product.hasOffset) {
    matches.push("the regulated or platform complexity you want");
  } else if (preferences.offset) {
    misses.push("less role complexity than requested");
  }

  if (preferences.rewards && product.hasRewards) {
    matches.push("consumer scale or brand reach");
  } else if (preferences.rewards) {
    misses.push("less market visibility than requested");
  }

  if (matches.length === 0 && misses.length === 0) {
    return "General ranking based on role fit, access path, and fintech signal strength.";
  }

  if (matches.length > 0 && misses.length === 0) {
    return `Strong match because it offers ${matches.join(", ")}.`;
  }

  if (matches.length === 0 && misses.length > 0) {
    return `Lower match because there is ${misses.join(", ")}.`;
  }

  return `Mixed match: offers ${matches.join(", ")}, but shows ${misses.join(", ")}.`;
}
