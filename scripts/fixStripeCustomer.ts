import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import Stripe from "stripe";
import prisma from "../src/lib/db";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing. Check .env.local or .env");
}

const stripe = new Stripe(secretKey);

async function run() {
  const businesses = await prisma.business.findMany({
    where: {
      stripeCustomerId: null,
      subscriptionId: {
        not: null,
      },
    },
  });

  for (const b of businesses) {
    const sub = await stripe.subscriptions.retrieve(b.subscriptionId!);

    await prisma.business.update({
      where: { id: b.id },
      data: {
        stripeCustomerId: sub.customer as string,
      },
    });

    console.log("Fixed:", b.name, sub.customer);
  }
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
