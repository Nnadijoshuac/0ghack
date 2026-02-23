import { NextResponse } from "next/server";
import { fetchPoolMembers, fetchPools } from "@/lib/backend/chain-read";

type Context = {
  params: Promise<{ poolId: string }>;
};

export async function GET(_: Request, context: Context) {
  try {
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

    const members = await fetchPoolMembers(pool.address);
    return NextResponse.json({ pool, members });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch pool members" },
      { status: 500 }
    );
  }
}
