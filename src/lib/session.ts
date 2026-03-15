import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET as string;

if (!SECRET) {
  throw new Error("AUTH_SECRET is not defined");
}

type SessionPayload = {
  userId: string;
  businessId: string;
};

export function createSession(payload: SessionPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "30d",
    issuer: "fideliza",
  });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET, {
      issuer: "fideliza",
    }) as JwtPayload;

    return {
      userId: decoded.userId as string,
      businessId: decoded.businessId as string,
    };
  } catch {
    return null;
  }
}
