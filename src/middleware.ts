import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo proteger dashboard del business
  if (pathname.startsWith("/business/") && pathname.includes("/dashboard")) {
    const session = req.cookies.get("business_session");

    if (!session) {
      const slug = pathname.split("/")[2];
      return NextResponse.redirect(new URL(`/business/${slug}/login`, req.url));
    }
  }

  return NextResponse.next();
}
