import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { slug, pin } = await req.json();

  // 1️⃣ Buscar negocio
  const business = await prisma.business.findUnique({
    where: { slug },
  });

  // ❌ Negocio no existe
  if (!business) {
    return Response.json({ error: "Invalid" }, { status: 401 });
  }

  // ✅ Negocio SIN PIN → acceso directo (DEMO)
  if (!business.pinHash) {
    return Response.json({ ok: true });
  }

  // 🔐 Negocio CON PIN → validar
  const valid = await bcrypt.compare(pin ?? "", business.pinHash);

  if (!valid) {
    return Response.json({ error: "Invalid" }, { status: 401 });
  }

  // ✅ Acceso permitido
  return Response.json({ ok: true });
}
