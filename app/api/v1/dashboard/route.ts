import { NextResponse } from "next/server";
import { fetchLatestPool, fetchPools } from "@/lib/backend/chain-read";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { isPoolVisibleOnHome, loadAccessDb } from "@/lib/backend/pool-access";

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    const pseudonym = session?.pseudonym?.trim() || "Builder";

    const [latestPool, pools, accessDb] = await Promise.all([
      fetchLatestPool(),
      fetchPools(),
      loadAccessDb()
    ]);

    const goalPoolByAddress = new Map(
      pools.map((pool) => [pool.address.toLowerCase(), pool])
    );

    const visibleGoals = accessDb.pools
      .filter((item) => item.type === "GOAL" && isPoolVisibleOnHome(item, session))
      .map((item) => {
        if (!item.address) return null;
        return goalPoolByAddress.get(item.address.toLowerCase()) ?? null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const visibleImpacts = accessDb.pools
      .filter((item) => item.type === "IMPACT" && isPoolVisibleOnHome(item, session))
      .map((item) => ({
        id: item.id,
        address: item.id,
        type: item.type,
        name: item.name,
        category: item.category,
        target: item.target,
        raised: item.raised,
        contributionPerPerson: item.contributionPerPerson,
        contributorsPaid: 0,
        contributorsTotal: 0,
        startAtISO: item.createdAtISO,
        deadlineISO: item.updatedAtISO,
        status: "ACTIVE" as const,
        adminAddress: "public"
      }));

    const visiblePools = [...visibleGoals, ...visibleImpacts];
    const totalRaised = visiblePools.reduce((sum, item) => sum + item.raised, 0);

    const recentActivity = visiblePools.length > 0
      ? [
          {
            icon: "POOL",
            title: "Pools synced",
            time: new Date().toLocaleString(),
            amount: `${visiblePools.length} pool(s)`,
            positive: null
          }
        ]
      : [];

    return NextResponse.json({
      viewer: {
        name: pseudonym,
        handle: pseudonym,
        initials: pseudonym.slice(0, 2).toUpperCase()
      },
      balance: {
        total: totalRaised,
        available: 0,
        locked: totalRaised
      },
      pools: visiblePools,
      latestPool:
        visiblePools.find((pool) => pool.address === latestPool?.address) ??
        visiblePools[visiblePools.length - 1] ??
        null,
      recentActivity
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}
