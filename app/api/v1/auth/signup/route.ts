import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth/session";
import { loadAuthDb, saveAuthDb } from "@/lib/auth/db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      pseudonym?: string;
      email?: string;
      password?: string;
    };

    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    const pseudonym = body.pseudonym?.trim() || "";
    const email = body.email?.trim().toLowerCase() || "";
    const password = body.password || "";

    if (!firstName || !lastName || !pseudonym || !email || password.length < 8) {
      return NextResponse.json(
        { error: "Provide valid name, pseudonym, email, and password (min 8 chars)." },
        { status: 400 }
      );
    }

    const db = await loadAuthDb();
    const exists = db.users.some((user) => user.email === email);
    if (exists) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      id: randomUUID(),
      firstName,
      lastName,
      pseudonym,
      email,
      passwordHash,
      createdAtISO: new Date().toISOString()
    };

    db.users.push(user);
    await saveAuthDb(db);

    const token = createSessionToken({ sub: user.id, email: user.email, pseudonym: user.pseudonym });
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        pseudonym: user.pseudonym,
        email: user.email
      }
    });

    response.cookies.set("poolfi_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed." },
      { status: 500 }
    );
  }
}

