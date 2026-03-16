import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/login", "/register", "/"];

  if (publicRoutes.includes(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = verifySession(token);

  if (!session) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("session");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/dashboard/:path*", "/scanner/:path*"],
};
