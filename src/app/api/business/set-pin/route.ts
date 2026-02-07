export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/db";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { slug, pin } = await req.json();

  if (!slug || !pin) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const hash = await bcrypt.hash(pin, 10);

  await prisma.business.update({
    where: { slug },
    data: {
      pinHash: hash,
    },
  });

  return Response.json({ ok: true });
}

