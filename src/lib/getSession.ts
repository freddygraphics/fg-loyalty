import { cookies } from "next/headers";

type Session = {
  userId: string;
  businessId: string;
  token: string;
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  const cookie = cookieStore.get("session");

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}
