import { TxType } from "@prisma/client";
import prisma from "@/lib/db";

/* =========================
   GET → Mostrar tarjeta
========================= */
export async function GET(
  _: Request,
  context: { params: Promise<{ token: string }> },
) {
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
  });
}

/* =========================
   POST → Sumar puntos
========================= */
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

    if (!card) {
      return Response.json({ error: "Tarjeta inválida" }, { status: 400 });
    }

    const pointsToAdd = card.business.earnStep;
    let newPoints = card.points + pointsToAdd;

    if (card.business.limitMode === "cap" && newPoints > card.business.goal) {
      newPoints = card.business.goal;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedCard = await tx.loyaltyCard.update({
        where: { id: card.id },
        data: { points: newPoints },
      });

      await tx.pointTransaction.create({
        data: {
          businessId: card.businessId,
          cardId: card.id,
          type: TxType.EARN,
          points: pointsToAdd,
        },
      });

      return updatedCard;
    });

    return Response.json({
      success: true,
      points: updated.points,
      reachedGoal: updated.points >= card.business.goal,
      customer: card.customer,
    });
  } catch (error) {
    console.error("❌ POST SCAN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
