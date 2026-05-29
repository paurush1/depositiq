import { NextResponse } from "next/server";
import { runIngestion } from "@/lib/ingestion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institutionId = searchParams.get("institutionId") ?? undefined;
  const fixture = searchParams.get("fixture") !== "false";
  const brandQuery = searchParams.get("brands") ?? undefined;
  const liveRegisterDiscovery = searchParams.get("register") === "true";
  const limitValue = Number.parseInt(searchParams.get("limit") ?? "3", 10);
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 10) : 3;

  try {
    const runs = await runIngestion({
      institutionId,
      useFixtureData: fixture,
      brandQuery,
      liveRegisterDiscovery,
      limit
    });
    const failedRuns = runs.filter((run) => run.error);

    return NextResponse.json({
      mode: fixture ? "fixture-preview" : liveRegisterDiscovery ? "register-live-fetch" : "live-fetch",
      generatedAt: new Date().toISOString(),
      successCount: runs.length - failedRuns.length,
      failureCount: failedRuns.length,
      runs
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown ingestion error"
      },
      { status: 500 }
    );
  }
}
