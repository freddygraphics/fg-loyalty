import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  const userId = request.cookies.get("userId")?.value;

  // scanner subdomain
  if (host === "scan.getfideliza.com") {
    return NextResponse.rewrite(new URL("/scanner", request.url));
  }

  // dashboard subdomain
  if (host === "app.getfideliza.com") {
    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // dejar pasar la ruta normal
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
