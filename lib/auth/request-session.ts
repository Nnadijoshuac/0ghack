import { verifySessionToken } from "@/lib/auth/session";

export type RequestSession = {
  sub: string;
  email?: string;
  pseudonym?: string;
};

export function getSessionFromRequest(request: Request): RequestSession | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/poolfi_session=([^;]+)/);
  const token = match?.[1];
  const session = verifySessionToken(token);
  if (!session || typeof session.sub !== "string" || !session.sub.trim()) return null;

  return {
    sub: session.sub,
    email: typeof session.email === "string" ? session.email : undefined,
    pseudonym: typeof session.pseudonym === "string" ? session.pseudonym : undefined
  };
}

