import { NextResponse } from "next/server";
import { fetchPools } from "@/lib/backend/chain-read";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { isPoolVisibleOnMyPools, loadAccessDb } from "@/lib/backend/pool-access";

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return NextResponse.json({ pool: null });

    const [pools, accessDb] = await Promise.all([fetchPools(), loadAccessDb()]);
    const visibleGoal = accessDb.pools
      .filter((item) => item.type === "GOAL" && isPoolVisibleOnMyPools(item, session))
      .slice()
      .reverse()
      .find((item) => item.address && pools.some((pool) => pool.address.toLowerCase() === item.address?.toLowerCase()));

    if (!visibleGoal?.address) {
      return NextResponse.json({ pool: null });
    }

    const pool = pools.find((item) => item.address.toLowerCase() === visibleGoal.address?.toLowerCase()) ?? null;
    return NextResponse.json({ pool });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch latest pool" },
      { status: 500 }
    );
  }
}
