import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  const userId = request.cookies.get("userId")?.value;
  const businessId = request.cookies.get("businessId")?.value;

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
    return NextResponse.redirect(new URL("https://getfideliza.com/login"));
  }

  /* -----------------------------
     DASHBOARD PROTECTION
  ----------------------------- */

  if (host === "app.getfideliza.com") {
    if (!userId) {
      return NextResponse.redirect(new URL("https://getfideliza.com/login"));
    }

    if (!businessId) {
      return NextResponse.redirect(new URL("https://getfideliza.com/login"));
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
      return NextResponse.redirect(new URL("https://getfideliza.com/login"));
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

    if (!trialValid && !activeSubscription) {
      return NextResponse.redirect(new URL("https://getfideliza.com/billing"));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
