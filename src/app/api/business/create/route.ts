export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as bcrypt from "bcryptjs";

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
      userId, // 👈 usuario creador
    } = body;

    if (!name || !slug || !pin || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🔒 Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // 🏪 Crear business (OWNER OBLIGATORIO)
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        pinHash,
        goal: goal ?? 50,
        earnStep: earnStep ?? 5,
        limitMode: limitMode ?? "cap",
        redeemMode: redeemMode ?? "reset",

        // ✅ ESTO ES LO QUE FALTABA
        ownerId: userId,
      },
    });

    // 👤 Relación roles (extra, correcto)

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

