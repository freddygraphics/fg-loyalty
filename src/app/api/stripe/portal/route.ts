import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

const stripe = new Stripe(stripeSecretKey);

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const slug = requestUrl.searchParams.get("slug");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing business slug" },
        { status: 400 },
      );
    }

    // Leer la cookie JWT actual
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", appUrl));
    }

    const session = verifySessionToken(token);

    if (!session) {
      const response = NextResponse.redirect(new URL("/login", appUrl));

      response.cookies.delete("session");
      return response;
    }

    // Confirmar que el negocio corresponde a esta sesión
    const business = await prisma.business.findFirst({
      where: {
        id: session.businessId,
        slug,
        ownerId: session.userId,
      },
      select: {
        id: true,
        slug: true,
        stripeCustomerId: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found or access denied" },
        { status: 403 },
      );
    }

    if (!business.stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe customer not found" },
        { status: 400 },
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: business.stripeCustomerId,
      return_url: `${appUrl}/business/${business.slug}/dashboard`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error("STRIPE PORTAL ERROR:", error);

    return NextResponse.json(
      { error: "Could not open the billing portal" },
      { status: 500 },
    );
  }
}
