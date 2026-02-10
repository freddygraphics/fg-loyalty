import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  try {
    const { slug } = await context.params;
    const { pin } = await req.json();

    if (typeof pin !== "string") {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { slug },
      select: { pinHash: true },
    });

    if (!business) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const isValid = await bcrypt.compare(pin, business.pinHash);

    return NextResponse.json({ success: isValid });
  } catch (error) {
    console.error("VERIFY PIN ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
