import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const { pin } = await req.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN requerido" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business || !business.pinHash) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 },
      );
    }

    const isValid = await bcrypt.compare(pin, business.pinHash);

    if (!isValid) {
      return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
    }

    // 🍪 Crear cookie de sesión
    const res = NextResponse.json({ success: true });

    res.cookies.set(
      "business_session",
      JSON.stringify({
        businessId: business.id,
        slug: business.slug,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    );

    return res;
  } catch (error) {
    console.error("❌ BUSINESS LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
