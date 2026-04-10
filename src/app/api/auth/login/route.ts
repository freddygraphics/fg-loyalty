import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { createSessionToken } from "@/lib/session";

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
    const body = await req.json();

    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: ownerLoginSelect,
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const business = user.businesses?.[0];

    if (!business) {
      return NextResponse.json(
        { error: "Esta cuenta no tiene negocio asociado" },
        { status: 404 },
      );
    }

    const token = createSessionToken({
      userId: user.id,
      businessId: business.id,
    });

    const response = NextResponse.json({
      success: true,
      redirect: `/business/${business.slug}/dashboard`,
    });

    response.cookies.set({
      name: "owner_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
