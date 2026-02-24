import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { listCreatorImpactPools } from "@/lib/backend/pool-access";

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const poolId = (url.searchParams.get("poolId") || "").trim().toLowerCase();
    const pools = await listCreatorImpactPools(session);
    const pool = poolId ? pools.find((item) => item.id.toLowerCase() === poolId) ?? null : pools[0] ?? null;

    if (!pool) return NextResponse.json({ pool: null });

    return NextResponse.json({
      pool: {
        id: pool.id,
        name: pool.name,
        category: pool.category,
        description: pool.description || "",
        target: pool.target,
        raised: pool.raised,
        contributionPerPerson: pool.contributionPerPerson,
        updatesCount: pool.impactUpdates?.length ?? 0,
        withdrawalsCount: pool.impactWithdrawals?.length ?? 0,
        createdAtISO: pool.createdAtISO,
        updatedAtISO: pool.updatedAtISO
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch creator impact pool" },
      { status: 500 }
    );
  }
}
