import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { addImpactWithdrawal, listImpactWithdrawals } from "@/lib/backend/pool-access";

type Context = {
  params: Promise<{ poolId: string }>;
};

export async function GET(request: Request, context: Context) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { poolId } = await context.params;
    const list = await listImpactWithdrawals(poolId, session);
    if (!list) return NextResponse.json({ error: "Impact pool not found" }, { status: 404 });
    return NextResponse.json({ withdrawals: list });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load withdrawals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { poolId } = await context.params;
    const body = (await request.json()) as {
      amount?: number;
      purpose?: string;
      vendor?: string;
      stage?: string;
    };

    const amount = Number(body.amount ?? 0);
    const purpose = body.purpose?.trim() || "";
    const vendor = body.vendor?.trim() || "";
    const stage = body.stage?.trim() || "";

    if (!Number.isFinite(amount) || amount <= 0 || !purpose || !vendor || !stage) {
      return NextResponse.json(
        { error: "amount, purpose, vendor, and stage are required" },
        { status: 400 }
      );
    }

    const created = await addImpactWithdrawal({
      poolId,
      session,
      amount,
      purpose,
      vendor,
      stage
    });

    if (!created) return NextResponse.json({ error: "Impact pool not found" }, { status: 404 });
    return NextResponse.json({ ok: true, withdrawal: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}
