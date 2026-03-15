import jwt from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET!;

export function createSession(payload: { userId: string; businessId: string }) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "30d",
  });
}

export function verifySession(token: string) {
  try {
    return jwt.verify(token, SECRET) as {
      userId: string;
      businessId: string;
    };
  } catch {
    return null;
  }
}
