import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { businessId, email } = await req.json();

    const priceId = process.env.STRIPE_STARTER_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!businessId || !email) {
      return NextResponse.json(
        { error: "businessId and email are required" },
        { status: 400 },
      );
    }

    if (!priceId || !appUrl) {
      console.error("Missing Stripe Checkout environment variables");

      return NextResponse.json(
        { error: "Stripe Checkout is not configured" },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      client_reference_id: businessId,

      metadata: {
        businessId,
      },

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      subscription_data: {
        trial_period_days: 7,
        metadata: {
          businessId,
        },
      },

      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/pricing`,
    });

    if (!session.url) {
      throw new Error("Stripe Checkout did not return a URL");
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      { error: "Could not create Checkout session" },
      { status: 500 },
    );
  }
}
