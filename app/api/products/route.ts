import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  return NextResponse.json({
    data: getProducts(category),
    meta: {
      mode: "fintech-targeting-workspace",
      generatedAt: new Date().toISOString()
    }
  });
}
