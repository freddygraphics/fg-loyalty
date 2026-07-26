import Stripe from "stripe";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { SubscriptionStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ==========================================================
// Convertir estado de Stripe al estado de Prisma
// ==========================================================
function mapStripeStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
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

// ==========================================================
// Obtener Stripe Customer ID
// ==========================================================
function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null;

  return typeof customer === "string" ? customer : customer.id;
}

// ==========================================================
// Obtener Price ID de la suscripción
// ==========================================================
function getSubscriptionPriceId(
  subscription: Stripe.Subscription,
): string | null {
  return subscription.items.data[0]?.price?.id ?? null;
}

// ==========================================================
// Obtener final del periodo actual
// ==========================================================
function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): Date | null {
  const timestamp = subscription.items.data[0]?.current_period_end;

  return timestamp ? new Date(timestamp * 1000) : null;
}

// ==========================================================
// Obtener Subscription ID desde una factura
// ==========================================================
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription =
    invoice.parent?.subscription_details?.subscription ?? null;

  if (!subscription) return null;

  return typeof subscription === "string" ? subscription : subscription.id;
}

// ==========================================================
// Verificar si el evento ya fue procesado
// ==========================================================
async function eventWasProcessed(eventId: string) {
  const existingEvent = await prisma.stripeWebhookEvent.findUnique({
    where: {
      id: eventId,
    },
  });

  return Boolean(existingEvent);
}

// ==========================================================
// Marcar evento como procesado
// IMPORTANTE: se hace después de procesarlo correctamente
// ==========================================================
async function markEventProcessed(eventId: string) {
  await prisma.stripeWebhookEvent.create({
    data: {
      id: eventId,
    },
  });
}

// ==========================================================
// Webhook
// ==========================================================
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return new Response("Missing Stripe signature", {
      status: 400,
    });
  }

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");

    return new Response("Webhook secret is not configured", {
      status: 500,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature failed:", error);

    return new Response("Invalid signature", {
      status: 400,
    });
  }

  try {
    const alreadyProcessed = await eventWasProcessed(event.id);

    if (alreadyProcessed) {
      return new Response("Event already processed", {
        status: 200,
      });
    }

    switch (event.type) {
      // ======================================================
      // Checkout completado
      // ======================================================
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const businessId =
          session.metadata?.businessId ?? session.client_reference_id;

        if (!businessId) {
          console.error(
            "checkout.session.completed without businessId:",
            session.id,
          );
          break;
        }

        const stripeCustomerId = getCustomerId(session.customer);

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription?.id ?? null);

        let stripePriceId: string | null = null;
        let status: SubscriptionStatus = "TRIALING";
        let trialEndsAt: Date | null = null;
        let currentPeriodEnd: Date | null = null;
        let cancelAtPeriodEnd = false;

        // Recuperar la suscripción completa para guardar todos los datos
        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          stripePriceId = getSubscriptionPriceId(subscription);
          status = mapStripeStatus(subscription.status);
          trialEndsAt = subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null;
          currentPeriodEnd = getSubscriptionPeriodEnd(subscription);
          cancelAtPeriodEnd = subscription.cancel_at_period_end;
        }

        const result = await prisma.business.updateMany({
          where: {
            id: businessId,
          },
          data: {
            stripeCustomerId,
            subscriptionId,
            stripePriceId,
            status,
            trialEndsAt,
            currentPeriodEnd,
            cancelAtPeriodEnd,
          },
        });

        if (result.count === 0) {
          throw new Error(`Business not found for checkout: ${businessId}`);
        }

        break;
      }

      // ======================================================
      // Suscripción creada
      // ======================================================
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        const businessId = subscription.metadata?.businessId;

        if (!businessId) {
          console.error(
            "Subscription created without businessId:",
            subscription.id,
          );
          break;
        }

        const result = await prisma.business.updateMany({
          where: {
            id: businessId,
          },
          data: {
            stripeCustomerId: getCustomerId(subscription.customer),
            subscriptionId: subscription.id,
            stripePriceId: getSubscriptionPriceId(subscription),
            status: mapStripeStatus(subscription.status),
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        if (result.count === 0) {
          throw new Error(`Business not found for subscription: ${businessId}`);
        }

        break;
      }

      // ======================================================
      // Suscripción actualizada
      // ======================================================
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const businessId = subscription.metadata?.businessId;

        const result = await prisma.business.updateMany({
          where: businessId
            ? {
                OR: [{ id: businessId }, { subscriptionId: subscription.id }],
              }
            : {
                subscriptionId: subscription.id,
              },
          data: {
            stripeCustomerId: getCustomerId(subscription.customer),
            subscriptionId: subscription.id,
            stripePriceId: getSubscriptionPriceId(subscription),
            status: mapStripeStatus(subscription.status),
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        if (result.count === 0) {
          throw new Error(
            `Business not found for subscription: ${subscription.id}`,
          );
        }

        break;
      }

      // ======================================================
      // Suscripción eliminada/cancelada
      // ======================================================
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.business.updateMany({
          where: {
            subscriptionId: subscription.id,
          },
          data: {
            status: "CANCELED",
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
          },
        });

        break;
      }

      // ======================================================
      // Factura pagada
      // ======================================================
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);

        if (!subscriptionId) break;

        await prisma.business.updateMany({
          where: {
            subscriptionId,
          },
          data: {
            status: "ACTIVE",
          },
        });

        break;
      }

      // ======================================================
      // Falló el pago
      // ======================================================
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);

        if (!subscriptionId) break;

        await prisma.business.updateMany({
          where: {
            subscriptionId,
          },
          data: {
            status: "PAST_DUE",
          },
        });

        break;
      }

      // ======================================================
      // El trial está por terminar
      // ======================================================
      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.business.updateMany({
          where: {
            subscriptionId: subscription.id,
          },
          data: {
            status: mapStripeStatus(subscription.status),
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            stripeCustomerId: getCustomerId(subscription.customer),
            stripePriceId: getSubscriptionPriceId(subscription),
          },
        });

        break;
      }

      default:
        console.log(`Stripe event ignored: ${event.type}`);
        break;
    }

    // Solo guardar el evento después de procesarlo correctamente
    await markEventProcessed(event.id);

    return new Response("Webhook received", {
      status: 200,
    });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);

    // Stripe volverá a intentar porque devolvemos 500
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
