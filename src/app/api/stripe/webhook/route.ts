import Stripe from "stripe";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("Stripe event received:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const businessId = session.metadata?.businessId;
      const customerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;

      if (!businessId) break;

      await prisma.business.update({
        where: { id: businessId },
        data: {
          stripeCustomerId: customerId ?? undefined,
          subscriptionId: subscriptionId ?? undefined,
        },
      });

      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;

      const businessId = subscription.metadata?.businessId;

      if (!businessId) break;

      await prisma.business.update({
        where: { id: businessId },
        data: {
          subscriptionId: subscription.id,
          status: "TRIALING",
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
      });

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string;
      };

      if (!invoice.subscription) break;

      await prisma.business.updateMany({
        where: { subscriptionId: invoice.subscription },
        data: {
          status: "ACTIVE",
        },
      });

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string;
      };

      if (!invoice.subscription) break;

      await prisma.business.updateMany({
        where: { subscriptionId: invoice.subscription },
        data: {
          status: "PAST_DUE",
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.business.updateMany({
        where: { subscriptionId: subscription.id },
        data: { status: "CANCELED" },
      });

      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
}
