export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/db";
import { verifyPin } from "@/lib/pin";

export async function POST(req: Request) {
  const { token, pin } = await req.json();

  const card = await prisma.loyaltyCard.findUnique({
    where: { token },
    include: { business: true },
  });

  if (!card || !card.business.pinHash) {
    return Response.json({ error: "Caja no configurada" }, { status: 400 });
  }

  const ok = await verifyPin(pin, card.business.pinHash);

  if (!ok) {
    return Response.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  return Response.json({ success: true });
}
