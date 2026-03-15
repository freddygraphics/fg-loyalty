import { cookies } from "next/headers";
import crypto from "crypto";

export async function createSession(userId: string, businessId: string) {
  const session = JSON.stringify({
    userId,
    businessId,
    token: crypto.randomUUID(),
  });

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
}
