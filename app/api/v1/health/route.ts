import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "poolfi-api", version: "v1" });
}
