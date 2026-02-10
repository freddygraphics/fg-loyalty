import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  try {
    // ⚠️ OBLIGATORIO en Next nuevo
    const { slug } = await context.params;

    const body = await request.json();
    const pin = body?.pin;

    // 🔒 Validaciones
    if (typeof pin !== "string") {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be 4–6 digits" },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(pin, 10);

    await prisma.business.update({
      where: { slug },
      data: { pinHash: hash },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CHANGE PIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
