export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string; token: string }> },
) {
  try {
    // 🔑 IMPORTANTE: await params
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
    const goal = business.goal;

    // 2️⃣ Validar puntos suficientes
    if (current < goal) {
      return NextResponse.json(
        { error: "No alcanza la meta para redimir" },
        { status: 400 },
      );
    }

    let newPoints = current;

    // 3️⃣ Aplicar regla de redención
    if (business.redeemMode === "reset") {
      newPoints = 0;
    }

    if (business.redeemMode === "subtract") {
      newPoints = current - goal;
    }

    // 4️⃣ Actualizar tarjeta
    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: { points: newPoints },
    });

    // 5️⃣ Registrar transacción
    await prisma.pointTransaction.create({
      data: {
        businessId: business.id,
        cardId: card.id,
        type: "redeem",
        points: -goal,
        note: "Redención de recompensa",
      },
    });

    return NextResponse.json({
      success: true,
      newPoints,
      redeemed: true,
    });
  } catch (error) {
    console.error("❌ REDEEM ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
