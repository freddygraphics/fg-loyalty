import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { businessId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",

    customer_email: email,

    // ayuda a identificar el negocio
    client_reference_id: businessId,

    metadata: {
      businessId,
    },

    line_items: [
      {
        price: process.env.STRIPE_STARTER_PRICE_ID!,
        quantity: 1,
      },
    ],

    subscription_data: {
      trial_period_days: 7,
      metadata: {
        businessId,
      },
    },

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
