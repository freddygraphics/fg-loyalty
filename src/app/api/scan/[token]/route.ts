export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/db";

/* ======================================================
   GET → MOSTRAR TARJETA (CLIENTE)
====================================================== */
export async function GET(
  _: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;

    const card = await prisma.loyaltyCard.findUnique({
      where: { token },
      include: {
        business: true,
        customer: true,
      },
    });

    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    return Response.json({
      customerName: card.customer.name,
      businessName: card.business.name,
      points: card.points,
      goal: card.business.goal,
      active: card.active,
    });
  } catch (error) {
    console.error("❌ GET SCAN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

/* ======================================================
   POST → ESCANEAR Y SUMAR PUNTOS (NEGOCIO)
====================================================== */
export async function POST(
  _: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;

    const card = await prisma.loyaltyCard.findUnique({
      where: { token },
      include: {
        business: true,
        customer: true,
      },
    });

    if (!card || !card.active) {
      return Response.json({ error: "Tarjeta inválida" }, { status: 400 });
    }

    const pointsToAdd = card.business.earnStep;
    const newPoints = card.points + pointsToAdd;
    const reachedGoal = newPoints >= card.business.goal;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedCard = await tx.loyaltyCard.update({
        where: { id: card.id },
        data: {
          points: newPoints,
          active: !reachedGoal,
        },
      });

      await tx.pointTransaction.create({
        data: {
          businessId: card.businessId,
          cardId: card.id,
          type: "earn",
          points: pointsToAdd,
        },
      });

      return updatedCard;
    });

    return Response.json({
      success: true,
      points: updated.points,
      completed: !updated.active,
      customer: card.customer,
    });
  } catch (error) {
    console.error("❌ POST SCAN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
