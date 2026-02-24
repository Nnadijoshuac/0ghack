import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { joinImpactPool, loadAccessDb } from "@/lib/backend/pool-access";

function toImpactCard(pool: ReturnType<typeof loadAccessDb>["pools"][number], joined: boolean) {
  const progress = pool.target > 0 ? Math.min(100, Math.round((pool.raised / pool.target) * 100)) : 0;
  return {
    id: pool.id,
    title: pool.name,
    desc: "Community-governed impact pool open to all PoolFi users.",
    raised: pool.raised,
    target: pool.target,
    contributors: pool.joinedUserIds.length,
    progress,
    joined,
    category: pool.category
  };
}

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  const db = loadAccessDb();
  const impactPools = db.pools.filter((pool) => pool.type === "IMPACT");
  const cards = impactPools.map((pool) =>
    toImpactCard(pool, Boolean(session && pool.joinedUserIds.includes(session.sub)))
  );

  const totalRaised = cards.reduce((sum, item) => sum + item.raised, 0);
  const contributors = cards.reduce((sum, item) => sum + item.contributors, 0);

  return NextResponse.json({
    stats: {
      totalRaisedLabel: `N${totalRaised.toLocaleString("en-US")}`,
      contributorsLabel: contributors.toLocaleString("en-US"),
      activePools: String(cards.length),
      completedLabel: "0"
    },
    featured: cards[0] ?? null,
    cards
  });
}

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { poolId?: string };
    if (!body.poolId || !body.poolId.trim()) {
      return NextResponse.json({ error: "poolId is required" }, { status: 400 });
    }

    const joined = joinImpactPool(body.poolId, session);
    if (!joined) {
      return NextResponse.json({ error: "Impact pool not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, poolId: joined.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to join impact pool" },
      { status: 500 }
    );
  }
}

