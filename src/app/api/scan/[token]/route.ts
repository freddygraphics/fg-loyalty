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
   POST → Reset Automático
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
    const newPoints = card.points + pointsToAdd;
    const reachedGoal = newPoints >= card.business.goal;

    const result = await prisma.$transaction(async (tx) => {
      const finalPoints = reachedGoal ? 0 : newPoints;

      const updatedCard = await tx.loyaltyCard.update({
        where: { id: card.id },
        data: { points: finalPoints },
      });

      // Registrar EARN
      await tx.pointTransaction.create({
        data: {
          businessId: card.businessId,
          cardId: card.id,
          type: TxType.EARN,
          points: pointsToAdd,
        },
      });

      // Registrar REDEEM si llegó al goal
      if (reachedGoal) {
        await tx.pointTransaction.create({
          data: {
            businessId: card.businessId,
            cardId: card.id,
            type: TxType.REDEEM,
            points: card.business.goal,
          },
        });
      }

      return updatedCard;
    });

    return Response.json({
      success: true,
      points: result.points,
      reachedGoal,
      customer: card.customer,
    });
  } catch (error) {
    console.error("❌ POST SCAN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
