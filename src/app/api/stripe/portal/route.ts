import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { businessId } = await req.json();

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Stripe customer not found" },
      { status: 400 },
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: business.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.json({
    url: portalSession.url,
  });
}
