import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/poolfi_session=([^;]+)/);
  const token = match?.[1];
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, session });
}
