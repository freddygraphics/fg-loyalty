import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      pin,
      goal = 50,
      earnStep = 5,
      limitMode = "cap",
      redeemMode = "reset",
    } = body;

    if (!name || !slug || !pin) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        pinHash,
        goal,
        earnStep,
        limitMode,
        redeemMode,
      },
    });

    return NextResponse.json({
      success: true,
      slug: business.slug,
    });
  } catch (error: any) {
    console.error("❌ CREATE BUSINESS ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
