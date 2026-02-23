import { NextResponse } from "next/server";
import { poolMembers, pools } from "@/lib/mock-data";

type Context = {
  params: Promise<{ poolId: string }>;
};

export async function GET(_: Request, context: Context) {
  const { poolId } = await context.params;
  const pool = pools.find((item) => item.id === poolId);

  if (!pool) {
    return NextResponse.json({ error: "Pool not found" }, { status: 404 });
  }

  return NextResponse.json({
    pool,
    members: poolMembers
  });
}
