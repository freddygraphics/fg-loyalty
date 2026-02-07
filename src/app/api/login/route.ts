import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });

    if (!user || !user.business) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    // 👉 Sesión simple (temporal)
    const res = NextResponse.json({ success: true });

    res.cookies.set("session", String(user.id), {
      httpOnly: true,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
