import prisma from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const card = await prisma.loyaltyCard.findUnique({
    where: { token: params.token },
  });

  if (!card) {
    return Response.json({ error: "Tarjeta no encontrada" }, { status: 404 });
  }

  if (card.status !== "READY") {
    return Response.json(
      { error: "Tarjeta no lista para canje" },
      { status: 400 },
    );
  }

  const redeemed = await prisma.loyaltyCard.update({
    where: { token: params.token },
    data: {
      status: "REDEEMED",
      redeemedAt: new Date(),
    },
  });

  return Response.json({ success: true, card: redeemed });
}
