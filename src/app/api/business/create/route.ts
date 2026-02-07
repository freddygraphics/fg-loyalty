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
      goal,
      earnStep,
      limitMode,
      redeemMode,
      userId, // el usuario logueado
    } = body;

    if (!name || !slug || !pin || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🔒 Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // 🏪 Crear business
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        goal: goal ?? 50,
        earnStep: earnStep ?? 5,
        limitMode: limitMode ?? "cap",
        redeemMode: redeemMode ?? "reset",
        pinHash,
      },
    });

    // 👤 Asignar owner
    await prisma.businessUser.create({
      data: {
        businessId: business.id,
        userId,
        role: "owner",
      },
    });

    return NextResponse.json({
      success: true,
      businessId: business.id,
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
