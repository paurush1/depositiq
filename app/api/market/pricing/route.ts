import { NextResponse } from "next/server";
import { getMarketPricingPayload } from "@/lib/depositiq/market";
import type { MarketDataMode } from "@/lib/depositiq/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get("mode") === "fallback" ? "fallback" : "live") as MarketDataMode;

  try {
    const payload = await getMarketPricingPayload(mode);
    return NextResponse.json(payload);
  } catch (error) {
    const payload = await getMarketPricingPayload("fallback");

    return NextResponse.json(
      {
        ...payload,
        summary: {
          ...payload.summary,
          warnings: [
            error instanceof Error
              ? error.message
              : "Unexpected market data error. Showing fallback data.",
            ...payload.summary.warnings
          ]
        }
      },
      { status: 200 }
    );
  }
}
