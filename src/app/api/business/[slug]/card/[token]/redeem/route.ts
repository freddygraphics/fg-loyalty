export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string; token: string }> },
) {
  try {
    const { slug, token } = await context.params;

    // 1️⃣ Buscar tarjeta por token + negocio
    const card = await prisma.loyaltyCard.findFirst({
      where: {
        token,
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

    // 3️⃣ Lógica simple: resetear puntos al redimir
    const newPoints = current - goal;

    // 4️⃣ Actualizar tarjeta
    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: { points: newPoints },
    });

    // 5️⃣ Registrar transacción con ENUM correcto
    await prisma.pointTransaction.create({
      data: {
        businessId: business.id,
        cardId: card.id,
        type: "REDEEM", // 👈 ENUM correcto
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
