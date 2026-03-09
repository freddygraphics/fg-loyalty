import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

const ownerLoginSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  password: true,
  businesses: {
    select: {
      id: true,
      slug: true,
    },
  },
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validar campos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: ownerLoginSelect,
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Comparar contraseña
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Obtener negocio del usuario
    const business = user.businesses?.[0];

    if (!business) {
      return NextResponse.json(
        { error: "Business not found for this account" },
        { status: 404 },
      );
    }

    // Crear respuesta con redirect
    const res = NextResponse.json({
      success: true,
      redirectTo: `/business/${business.slug}/dashboard`,
    });

    // Crear cookie segura
    res.cookies.set("owner_session", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
