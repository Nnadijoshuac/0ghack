import { NextResponse } from "next/server";
import { fetchPools } from "@/lib/backend/chain-read";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { isPoolVisibleOnMyPools, loadAccessDb } from "@/lib/backend/pool-access";

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ pools: [] });
    }

    const [chainPools, accessDb] = await Promise.all([fetchPools(), loadAccessDb()]);
    const goalPoolByAddress = new Map(
      chainPools.map((pool) => [pool.address.toLowerCase(), pool])
    );

    const visibleGoals = accessDb.pools
      .filter((item) => item.type === "GOAL" && isPoolVisibleOnMyPools(item, session))
      .map((item) => {
        if (!item.address) return null;
        return goalPoolByAddress.get(item.address.toLowerCase()) ?? null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const joinedImpacts = accessDb.pools
      .filter((item) => item.type === "IMPACT" && isPoolVisibleOnMyPools(item, session))
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

    return NextResponse.json({ pools: [...visibleGoals, ...joinedImpacts] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch pools" },
      { status: 500 }
    );
  }
}

