import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { slug: string; token: string } },
) {
  try {
    const { slug, token } = params;

    // 1️⃣ Buscar tarjeta + negocio
    const card = await prisma.loyaltyCard.findFirst({
      where: {
        token,
        business: { slug },
        active: true,
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

    // 2️⃣ APLICAR LÍMITE
    if (business.limitMode === "cap" && newPoints > goal) {
      newPoints = goal;
    }

    // 3️⃣ Actualizar puntos
    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: { points: newPoints },
    });

    // 4️⃣ Registrar transacción
    await prisma.pointTransaction.create({
      data: {
        businessId: business.id,
        cardId: card.id,
        type: "earn",
        points: step,
        note: "Suma de puntos",
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
