import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { registerGoalPool } from "@/lib/backend/pool-access";

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      address?: string;
      name?: string;
      category?: string;
      target?: number;
      contributionPerPerson?: number;
      invitedMembers?: string[];
    };

    if (!body.address || !body.name) {
      return NextResponse.json({ error: "address and name are required" }, { status: 400 });
    }

    const pool = registerGoalPool({
      session,
      address: body.address,
      name: body.name,
      category: body.category || "General",
      target: Number(body.target ?? 0),
      contributionPerPerson: Number(body.contributionPerPerson ?? 0),
      invitedMembers: Array.isArray(body.invitedMembers) ? body.invitedMembers : []
    });

    return NextResponse.json({ ok: true, pool });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register goal pool" },
      { status: 500 }
    );
  }
}

