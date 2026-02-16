export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  _req: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    // 🔑 await params
    const { token } = await context.params;

    const card = await prisma.loyaltyCard.findUnique({
      where: {
        token,
      },
      include: {
        business: true,
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Tarjeta no encontrada" },
        { status: 404 },
      );
    }

    const goal = card.business.goal;
    const current = card.points;

    if (current < goal) {
      return NextResponse.json(
        { error: "No alcanza la meta para redimir" },
        { status: 400 },
      );
    }

    let newPoints = current;

    if (card.business.redeemMode === "reset") {
      newPoints = 0;
    }

    if (card.business.redeemMode === "subtract") {
      newPoints = current - goal;
    }

    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: { points: newPoints },
    });

    await prisma.pointTransaction.create({
      data: {
        businessId: card.businessId,
        cardId: card.id,
        type: "REDEEM",
        points: -goal,
        note: "Redención",
      },
    });

    return NextResponse.json({
      success: true,
      newPoints,
    });
  } catch (error) {
    console.error("❌ REDEEM (token) ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
