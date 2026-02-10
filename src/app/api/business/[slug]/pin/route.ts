import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    // ✅ CLAVE: esperar params
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing business slug" },
        { status: 400 },
      );
    }

    const { pin } = await req.json();

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
    }

    const hash = await bcrypt.hash(pin, 10);

    await prisma.business.update({
      where: { slug }, // ✅ slug válido
      data: {
        pinHash: hash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ CHANGE PIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
