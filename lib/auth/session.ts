import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.AUTH_SESSION_SECRET || "dev-auth-secret-change-me";
}

function sign(raw: string) {
  return createHmac("sha256", getSecret()).update(raw).digest("hex");
}

export function createSessionToken(payload: Record<string, string | number>) {
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + DEFAULT_TTL_SECONDS
  };

  const raw = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = sign(raw);
  return `${raw}.${sig}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;

  const [raw, sig] = token.split(".");
  if (!raw || !sig) return null;

  const expected = sign(raw);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");

  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as {
      exp: number;
      [key: string]: string | number;
    };

    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}
