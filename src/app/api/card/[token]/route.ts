import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;

  const card = await prisma.loyaltyCard.findUnique({
    where: { token },
    include: {
      customer: true,
      business: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const remaining = Math.max(card.business.goal - card.points, 0);

  return NextResponse.json({
    token: card.token,
    points: card.points,
    remaining,
    customerName: card.customer.name,
    businessName: card.business.name,
    goal: card.business.goal,
  });
}
