import { NextResponse } from "next/server";
import { fetchPoolMembers, fetchPools } from "@/lib/backend/chain-read";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { canAccessPool, loadAccessDb } from "@/lib/backend/pool-access";

type Context = {
  params: Promise<{ poolId: string }>;
};

export async function GET(request: Request, context: Context) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { poolId } = await context.params;
    const pools = await fetchPools();

    const pool = pools.find(
      (item) =>
        item.id.toLowerCase() === poolId.toLowerCase() ||
        item.address.toLowerCase() === poolId.toLowerCase()
    );

    if (!pool) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    const accessDb = await loadAccessDb();
    const accessPool = accessDb.pools.find(
      (item) => item.type === "GOAL" && item.address?.toLowerCase() === pool.address.toLowerCase()
    );
    if (accessPool && !canAccessPool(accessPool, session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const members = await fetchPoolMembers(pool.address);
    return NextResponse.json({ pool, members });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch pool members" },
      { status: 500 }
    );
  }
}
