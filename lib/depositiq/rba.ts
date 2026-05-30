import { fallbackCashRate } from "@/lib/depositiq/fallback";
import type { CashRateMarketAnchor } from "@/lib/depositiq/types";

export async function getRbaCashRate(): Promise<CashRateMarketAnchor> {
  return fallbackCashRate;
}
