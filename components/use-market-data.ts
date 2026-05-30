"use client";

import { useCallback, useEffect, useState } from "react";
import { getFallbackMarketPricingPayload } from "@/lib/depositiq/market";
import type { MarketDataMode, MarketPricingPayload } from "@/lib/depositiq/types";

export function useMarketData(initialMode: MarketDataMode = "live") {
  const [mode, setMode] = useState<MarketDataMode>(initialMode);
  const [data, setData] = useState<MarketPricingPayload | null>(
    getFallbackMarketPricingPayload()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/market/pricing?mode=${mode}`, {
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(`Market data request failed with status ${response.status}.`);
      }
      const payload = (await response.json()) as MarketPricingPayload;
      setData(payload);
    } catch (fetchError) {
      setData((current) => current ?? getFallbackMarketPricingPayload());
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to refresh market data."
      );
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { mode, setMode, data, loading, error, refresh };
}
