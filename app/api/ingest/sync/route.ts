import { NextResponse } from "next/server";
import { getSyncDiagnostics, syncComparisonCatalog } from "@/lib/catalog";

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}

async function handleSync(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandQuery = searchParams.get("brands") ?? "commbank,westpac";
  const limitValue = Number.parseInt(searchParams.get("limit") ?? "2", 10);
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 10) : 2;

  try {
    const result = await syncComparisonCatalog({
      brandQuery,
      limit
    });

    return NextResponse.json({
      mode: "database-sync",
      generatedAt: new Date().toISOString(),
      productCount: result.productCount,
      failureCount: result.failureCount,
      diagnostics: getSyncDiagnostics(result.runs)
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown sync error"
      },
      { status: 500 }
    );
  }
}
