import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { qr } = await req.json();

    if (!qr) {
      return NextResponse.json({ error: "QR_REQUIRED" }, { status: 400 });
    }

    // 🔍 Buscar la tarjeta real
    const card = await prisma.loyaltyCard.findUnique({
      where: { token: qr },
      include: {
        customer: true,
        business: true,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "INVALID_QR" }, { status: 404 });
    }

    if (!card.active) {
      return NextResponse.json({ error: "CARD_INACTIVE" }, { status: 403 });
    }

    // ➕ Sumar puntos (usando earnStep del negocio)
    const pointsToAdd = card.business.earnStep;

    const updatedCard = await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: {
        points: {
          increment: pointsToAdd,
        },
      },
    });

    // 🧾 Registrar transacción
    await prisma.pointTransaction.create({
      data: {
        businessId: card.businessId,
        cardId: card.id,
        type: "earn",
        points: pointsToAdd,
        note: "QR scan",
      },
    });

    return NextResponse.json({
      success: true,
      customer: {
        id: card.customer.id,
        name: card.customer.name,
      },
      pointsAdded: pointsToAdd,
      totalPoints: updatedCard.points,
      goal: card.business.goal,
    });
  } catch (e) {
    console.error("SCAN ERROR", e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
