import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas públicas
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("owner_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!);
    console.log("TOKEN OK:", decoded);
  } catch (err) {
    console.log("TOKEN INVALIDO");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
