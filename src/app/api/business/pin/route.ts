export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { slug, pin } = await req.json();

  const business = await prisma.business.findUnique({
    where: { slug },
  });

  if (!business) {
    return Response.json({ error: "Business no encontrado" }, { status: 404 });
  }

  const hash = await bcrypt.hash(pin, 10);

  await prisma.business.update({
    where: { id: business.id },
    data: { pinHash: hash },
  });

  return Response.json({ ok: true });
}

