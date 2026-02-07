import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;

    const card = await prisma.loyaltyCard.findUnique({
      where: { token },
      include: {
        customer: true,
        business: true,
      },
    });

    if (!card || !card.active) {
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
    console.error("❌ CARD ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
