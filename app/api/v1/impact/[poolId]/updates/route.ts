import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { addImpactUpdate, listImpactUpdates } from "@/lib/backend/pool-access";

type Context = {
  params: Promise<{ poolId: string }>;
};

export async function GET(request: Request, context: Context) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { poolId } = await context.params;
    const list = await listImpactUpdates(poolId, session);
    if (!list) return NextResponse.json({ error: "Impact pool not found" }, { status: 404 });
    return NextResponse.json({ updates: list });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load updates" },
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
      title?: string;
      details?: string;
      referenceLink?: string;
    };

    const title = body.title?.trim() || "";
    const details = body.details?.trim() || "";
    if (!title || !details) {
      return NextResponse.json({ error: "title and details are required" }, { status: 400 });
    }

    const created = await addImpactUpdate({
      poolId,
      session,
      title,
      details,
      referenceLink: body.referenceLink || ""
    });

    if (!created) return NextResponse.json({ error: "Impact pool not found" }, { status: 404 });
    return NextResponse.json({ ok: true, update: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create update" },
      { status: 500 }
    );
  }
}
