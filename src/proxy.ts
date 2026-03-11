import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const pathname = request.nextUrl.pathname;
  const userId = request.cookies.get("userId")?.value;

  if (host === "scan.getfideliza.com") {
    return NextResponse.rewrite(new URL("/scanner", request.url));
  }

  if (host === "app.getfideliza.com") {
    if (pathname.startsWith("/login")) {
      return NextResponse.next();
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
