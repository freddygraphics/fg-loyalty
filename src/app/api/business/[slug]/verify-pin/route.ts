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

    const valid = await bcrypt.compare(pin, business.pinHash);

    if (!valid) {
      return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ VERIFY PIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
