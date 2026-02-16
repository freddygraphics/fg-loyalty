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
    const step = 1; // 👈 Como no tienes earnStep en schema
    const goal = business.goal;

    let newPoints = current + step;

    // 2️⃣ Cap simple al goal
    if (newPoints > goal) {
      newPoints = goal;
    }

    // 3️⃣ Update card
    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: { points: newPoints },
    });

    // 4️⃣ Crear transaction (usar enum correcto)
    await prisma.pointTransaction.create({
      data: {
        businessId: business.id,
        cardId: card.id,
        type: "EARN", // 👈 ENUM correcto
        points: step,
        note: "Earn points",
      },
    });

    return NextResponse.json({
      success: true,
      newPoints,
      capped: current + step > goal,
    });
  } catch (error) {
    console.error("❌ EARN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
