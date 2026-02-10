import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// ==========================
// GET — OBTENER CONFIGURACIÓN
// ==========================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        name: true,
        goal: true,
        earnStep: true, // 👈 CLAVE
        limitMode: true,
        redeemMode: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(business);
  } catch (err) {
    console.error("❌ Settings GET error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ==========================
// PUT — GUARDAR CONFIGURACIÓN
// ==========================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    const goal = Number(body.goal);
    const earnStep = Number(body.earnStep);

    if (!Number.isFinite(goal) || goal <= 0) {
      return NextResponse.json({ error: "INVALID_GOAL" }, { status: 400 });
    }

    if (!Number.isFinite(earnStep) || earnStep <= 0) {
      return NextResponse.json({ error: "INVALID_EARN_STEP" }, { status: 400 });
    }

    const business = await prisma.business.update({
      where: { slug },
      data: {
        name: body.name,
        goal,
        earnStep,
        limitMode: body.limitMode,
        redeemMode: body.redeemMode,
      },
    });

    return NextResponse.json(business);
  } catch (err) {
    console.error("❌ Settings PUT error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
