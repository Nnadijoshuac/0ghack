import { NextResponse } from "next/server";
import { fetchPools } from "@/lib/backend/chain-read";

export async function GET() {
  try {
    const pools = await fetchPools();
    return NextResponse.json({ pools });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch pools" },
      { status: 500 }
    );
  }
}
