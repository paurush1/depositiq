import { NextResponse } from "next/server";
import { discoverBankingBrands } from "@/lib/ingestion/register";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandQuery = searchParams.get("brands") ?? undefined;
  const limitValue = Number.parseInt(searchParams.get("limit") ?? "10", 10);
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 20) : 10;

  try {
    const brands = await discoverBankingBrands({
      brandQuery,
      limit
    });

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      count: brands.length,
      brands
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown discovery error"
      },
      { status: 500 }
    );
  }
}
