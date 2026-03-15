import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing business slug" },
      { status: 400 },
    );
  }

  /* -----------------------------
     AUTH CHECK
  ----------------------------- */

  const userId = (await cookies()).get("userId")?.value;

  if (!userId) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_APP_URL),
    );
  }

  /* -----------------------------
     FIND BUSINESS
  ----------------------------- */

  const business = await prisma.business.findFirst({
    where: {
      slug,
      ownerId: userId,
    },
  });

  if (!business?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Stripe customer not found" },
      { status: 400 },
    );
  }

  /* -----------------------------
     CREATE STRIPE PORTAL SESSION
  ----------------------------- */

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: business.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/business/${slug}/dashboard`,
  });

  /* -----------------------------
     REDIRECT TO STRIPE
  ----------------------------- */

  return NextResponse.redirect(portalSession.url);
}
