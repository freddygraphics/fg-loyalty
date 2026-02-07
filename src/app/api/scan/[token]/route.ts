import prisma from "@/lib/db";

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

    // ❌ tarjeta inválida o inactiva
    if (!card || !card.active) {
      return Response.json({ error: "Tarjeta inválida" }, { status: 400 });
    }

    // ➕ sumar puntos según configuración del negocio
    const pointsToAdd = card.business.earnStep;
    const newPoints = card.points + pointsToAdd;

    // 🎯 llegó al goal
    const reachedGoal = newPoints >= card.business.goal;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedCard = await tx.loyaltyCard.update({
        where: { id: card.id },
        data: {
          points: newPoints,
          active: !reachedGoal, // se desactiva al completar
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
    console.error("❌ SCAN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
