import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const userId = request.cookies.get("userId")?.value;

  // scanner
  if (host === "scan.getfideliza.com") {
    return NextResponse.rewrite(new URL("/scanner", request.url));
  }

  // login siempre en dominio principal
  if (host === "app.getfideliza.com" && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("https://getfideliza.com/login"));
  }

  // dashboard
  if (host === "app.getfideliza.com") {
    if (!userId) {
      return NextResponse.redirect(new URL("https://getfideliza.com/login"));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
