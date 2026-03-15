import Stripe from "stripe";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "CANCELED";
    case "incomplete":
      return "TRIALING";
    default:
      return "TRIALING";
  }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;

  if (!sub) return null;

  return typeof sub === "string" ? sub : sub.id;
}

function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): Date | null {
  const firstItem = subscription.items.data[0];
  const periodEnd = firstItem?.current_period_end;

  if (!periodEnd) return null;

  return new Date(periodEnd * 1000);
}

async function markEventProcessed(eventId: string) {
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        id: eventId,
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    console.error("Stripe webhook signature failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const firstTimeSeen = await markEventProcessed(event.id);

  if (!firstTimeSeen) {
    return new Response("Event already processed", { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session.metadata?.businessId;

        if (!businessId) break;

        const stripeCustomerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer?.id ?? null);

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription?.id ?? null);

        await prisma.business.updateMany({
          where: { id: businessId },
          data: {
            stripeCustomerId,
            subscriptionId,
          },
        });

        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const businessId = subscription.metadata?.businessId;

        if (!businessId) break;

        await prisma.business.updateMany({
          where: { id: businessId },
          data: {
            subscriptionId: subscription.id,
            status: mapStripeStatus(subscription.status),
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.business.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            status: mapStripeStatus(subscription.status),
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.business.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            status: "CANCELED",
          },
        });

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);

        if (!subscriptionId) break;

        await prisma.business.updateMany({
          where: { subscriptionId },
          data: {
            status: "ACTIVE",
          },
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);

        if (!subscriptionId) break;

        await prisma.business.updateMany({
          where: { subscriptionId },
          data: {
            status: "PAST_DUE",
          },
        });

        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.business.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            status: mapStripeStatus(subscription.status),
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
          },
        });

        break;
      }

      default:
        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
