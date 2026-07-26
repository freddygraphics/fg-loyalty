import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import { createSessionToken } from "@/lib/session";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// convierte nombre a slug
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// genera slug único
function uniqueSlug(name: string) {
  const base = slugify(name);
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}

export async function POST(req: Request) {
  try {
    const { email, password, businessName } = await req.json();

    if (!email || !password || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const slug = uniqueSlug(businessName);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
        },
      });

      const business = await tx.business.create({
        data: {
          name: businessName,
          slug,
          owner: {
            connect: { id: user.id },
          },
          plan: "STARTER",
          status: "CANCELED",
        },
      });

      return { user, business };
    });

    const user = result.user;
    const business = result.business;

    // 🔐 Auto-login cookie
    const cookieStore = await cookies();

    const token = createSessionToken({
      userId: user.id,
      businessId: business.id,
    });

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    // 💳 Crear Stripe Checkout con trial 7 días
    const priceId = process.env.STRIPE_STARTER_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!priceId || !appUrl) {
      console.error("Missing Stripe variables:", {
        hasPriceId: Boolean(priceId),
        hasAppUrl: Boolean(appUrl),
      });

      return NextResponse.json(
        { error: "Stripe Checkout is not configured" },
        { status: 500 },
      );
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: user.email,
        client_reference_id: business.id,

        metadata: {
          businessId: business.id,
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
            businessId: business.id,
          },
        },

        success_url: `${appUrl}/business/${business.slug}/dashboard?checkout=success`,
        cancel_url: `${appUrl}/pricing?checkout=canceled`,
      });

      if (!checkoutSession.url) {
        throw new Error("Stripe did not return a Checkout URL");
      }

      return NextResponse.json({
        stripeUrl: checkoutSession.url,
      });
    } catch (stripeError) {
      console.error("STRIPE CHECKOUT ERROR:", stripeError);

      return NextResponse.json(
        {
          error:
            stripeError instanceof Error
              ? stripeError.message
              : "Could not create Stripe Checkout",
        },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
