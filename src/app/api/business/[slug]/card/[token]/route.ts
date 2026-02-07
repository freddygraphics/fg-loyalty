export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string; token: string }> },
) {
  try {
    const { slug, token } = await context.params;

    const card = await prisma.loyaltyCard.findFirst({
      where: {
        token,
        business: { slug },
      },
      include: {
        customer: true,
        business: true,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({
      token: card.token,
      points: card.points,
      goal: card.business.goal,
      customerName: card.customer.name,
      businessName: card.business.name,
    });
  } catch (error) {
    console.error("❌ BUSINESS CARD ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
