import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params; // 🔑 CLAVE
    const { pin } = await req.json();

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: "PIN inválido" }, { status: 400 });
    }

    const hash = await bcrypt.hash(pin, 10);

    await prisma.business.update({
      where: { slug },
      data: {
        pinHash: hash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating PIN:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
