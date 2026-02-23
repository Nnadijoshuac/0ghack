import { NextResponse } from "next/server";
import { fetchLatestPool, fetchPools } from "@/lib/backend/chain-read";
import { verifySessionToken } from "@/lib/auth/session";

function getSessionTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/poolfi_session=([^;]+)/);
  return match?.[1];
}

export async function GET(request: Request) {
  try {
    const [latestPool, pools] = await Promise.all([fetchLatestPool(), fetchPools()]);

    const token = getSessionTokenFromCookie(request.headers.get("cookie"));
    const session = verifySessionToken(token);
    const pseudonym =
      typeof session?.pseudonym === "string" && session.pseudonym.trim().length > 0
        ? session.pseudonym
        : "Builder";

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
