import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string; token: string }> },
) {
  try {
    const { slug, token } = await context.params;

    // 1️⃣ Buscar tarjeta + negocio
    const card = await prisma.loyaltyCard.findFirst({
      where: {
        token,
        active: true,
        business: { slug },
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

    const { business } = card;

    const current = card.points;
    const step = business.earnStep;
    const goal = business.goal;

    let newPoints = current + step;

    // 2️⃣ Límite
    if (business.limitMode === "cap" && newPoints > goal) {
      newPoints = goal;
    }

    // 3️⃣ Update card
    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: { points: newPoints },
    });

    // 4️⃣ Transaction
    await prisma.pointTransaction.create({
      data: {
        businessId: business.id,
        cardId: card.id,
        type: "earn",
        points: step,
        note: "Earn points",
      },
    });

    return NextResponse.json({
      success: true,
      newPoints,
      capped: business.limitMode === "cap" && current + step > goal,
    });
  } catch (error) {
    console.error("❌ EARN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
