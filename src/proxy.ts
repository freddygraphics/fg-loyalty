import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get("userId")?.value;
  const businessId = request.cookies.get("businessId")?.value;

  const loginUrl = "https://getfideliza.com/login";
  const billingUrl = "https://getfideliza.com/billing";

  /* -----------------------------
     STATIC / PUBLIC ROUTES
  ----------------------------- */

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  /* -----------------------------
     SCANNER DOMAIN
  ----------------------------- */

  if (host === "scan.getfideliza.com") {
    return NextResponse.rewrite(new URL("/scanner", request.url));
  }

  /* -----------------------------
     LOGIN REDIRECT
  ----------------------------- */

  if (host === "app.getfideliza.com" && pathname.startsWith("/login")) {
    return NextResponse.redirect(loginUrl);
  }

  /* -----------------------------
     DASHBOARD PROTECTION
  ----------------------------- */

  if (host === "app.getfideliza.com") {
    if (!userId || !businessId) {
      return NextResponse.redirect(loginUrl);
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        status: true,
        trialEndsAt: true,
        currentPeriodEnd: true,
      },
    });

    if (!business) {
      return NextResponse.redirect(loginUrl);
    }

    const now = new Date();

    const trialValid =
      business.status === "TRIALING" &&
      business.trialEndsAt &&
      business.trialEndsAt > now;

    const subscriptionActive =
      business.status === "ACTIVE" &&
      business.currentPeriodEnd &&
      business.currentPeriodEnd > now;

    const blockedStatus =
      business.status === "CANCELED" || business.status === "PAST_DUE";

    if (blockedStatus || (!trialValid && !subscriptionActive)) {
      return NextResponse.redirect(billingUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
