import { NextResponse } from "next/server";
import { fetchLatestPool } from "@/lib/backend/chain-read";

export async function GET() {
  try {
    const pool = await fetchLatestPool();
    return NextResponse.json({ pool });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch latest pool" },
      { status: 500 }
    );
  }
}
