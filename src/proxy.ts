import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { verifySession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  const loginUrl = "https://getfideliza.com/login";
  const billingUrl = "https://getfideliza.com/billing";

  /* -----------------------------
     IGNORE STATIC / API
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
     DASHBOARD PROTECTION
  ----------------------------- */

  if (host === "app.getfideliza.com") {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL(loginUrl));
    }

    const session = verifySession(sessionToken);

    if (!session) {
      return NextResponse.redirect(new URL(loginUrl));
    }

    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
      select: {
        status: true,
        trialEndsAt: true,
        currentPeriodEnd: true,
      },
    });

    if (!business) {
      return NextResponse.redirect(new URL(loginUrl));
    }

    const now = new Date();

    const trialValid =
      business.status === "TRIALING" &&
      business.trialEndsAt &&
      business.trialEndsAt > now;

    const activeSubscription =
      business.status === "ACTIVE" &&
      business.currentPeriodEnd &&
      business.currentPeriodEnd > now;

    const blockedStatus =
      business.status === "CANCELED" || business.status === "PAST_DUE";

    if (blockedStatus || (!trialValid && !activeSubscription)) {
      return NextResponse.redirect(new URL(billingUrl));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
