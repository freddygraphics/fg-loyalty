import prisma from "@/lib/db";

export async function POST(
  _: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    // 🔑 await params
    const { token } = await context.params;

    const card = await prisma.loyaltyCard.findUnique({
      where: { token },
    });

    if (!card || card.status !== "ACTIVE") {
      return Response.json({ error: "Tarjeta inválida" }, { status: 400 });
    }

    const nextVisits = card.visits + 1;

    const updated = await prisma.loyaltyCard.update({
      where: { token },
      data: {
        visits: { increment: 1 },
        lastVisitAt: new Date(),
        logs: { create: {} },
        status: nextVisits >= card.goal ? "READY" : "ACTIVE",
      },
      include: { customer: true },
    });

    return Response.json({
      card: updated,
      completed: updated.status === "COMPLETED",
    });
  } catch (error) {
    console.error("❌ SCAN ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
