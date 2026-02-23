import { NextResponse } from "next/server";
import { fetchLatestPool, fetchPools } from "@/lib/backend/chain-read";

export async function GET() {
  try {
    const [latestPool, pools] = await Promise.all([fetchLatestPool(), fetchPools()]);

    const totalRaised = pools.reduce((sum, item) => sum + item.raised, 0);

    const recentActivity = latestPool
      ? [
          {
            icon: "POOL",
            title: "Latest pool synced",
            time: new Date().toLocaleString(),
            amount: latestPool.name,
            positive: null
          }
        ]
      : [];

    return NextResponse.json({
      viewer: { name: "0G User", handle: "Builder", initials: "0G" },
      balance: {
        total: totalRaised,
        available: 0,
        locked: totalRaised
      },
      pools,
      latestPool,
      recentActivity
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}
