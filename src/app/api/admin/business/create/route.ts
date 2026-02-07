import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    // ⚠️ TEMPORAL: owner fijo (admin)
    const ownerId = 1;

    const { name, slug, pin, goal, earnStep, limitMode, redeemMode } =
      await req.json();

    if (!name || !slug || !pin) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
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
        ownerId,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("❌ Error creando business:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
