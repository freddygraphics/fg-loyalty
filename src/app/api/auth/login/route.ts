import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y password son requeridos" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
      include: { businesses: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // ✅ Debe existir al menos 1 negocio del owner
    // 🔥 Obtener negocio real del usuario
    const business = await prisma.business.findFirst({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Tu cuenta no tiene negocio asignado" },
        { status: 403 },
      );
    }

    // ✅ Cookie segura (HttpOnly) — el cliente NO puede leerla ni modificarla con JS
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
    console.log("Business encontrado:", business);
    return NextResponse.json({
      success: true,
      redirectTo: `/business/${business.slug}/dashboard`,
    });
  } catch (err) {
    return NextResponse.json({ error: "Error en login" }, { status: 500 });
  }
}
