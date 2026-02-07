import prisma from "@/lib/db";

export async function POST(
  _: Request,
  { params }: { params: { token: string } },
) {
  const card = await prisma.loyaltyCard.findUnique({
    where: { token: params.token },
  });

  if (!card || card.status !== "ACTIVE") {
    return Response.json({ error: "Tarjeta inválida" }, { status: 400 });
  }

  const nextVisits = card.visits + 1;

  const updated = await prisma.loyaltyCard.update({
    where: { token: params.token },
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
}
