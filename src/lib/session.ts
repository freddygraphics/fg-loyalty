import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET!; // 🔥 FIX

export type SessionPayload = {
  userId: string;
  businessId: string;
};

export function createSessionToken(payload: SessionPayload) {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: "30d",
    issuer: "fideliza",
  });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, AUTH_SECRET, {
      issuer: "fideliza",
    });

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "businessId" in decoded
    ) {
      return {
        userId: String(decoded.userId),
        businessId: String(decoded.businessId),
      };
    }

    return null;
  } catch {
    return null;
  }
}
