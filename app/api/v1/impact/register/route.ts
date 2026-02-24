import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/request-session";
import { registerImpactPool } from "@/lib/backend/pool-access";

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      category?: string;
      description?: string;
      target?: number;
      contributionPerPerson?: number;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const pool = await registerImpactPool({
      session,
      name: body.name.trim(),
      category: body.category?.trim() || "General",
      description: body.description?.trim() || "",
      target: Number(body.target ?? 0),
      contributionPerPerson: Number(body.contributionPerPerson ?? 0)
    });

    return NextResponse.json({ ok: true, pool });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register impact pool" },
      { status: 500 }
    );
  }
}
