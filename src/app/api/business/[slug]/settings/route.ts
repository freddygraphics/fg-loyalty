import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    // ✅ CLAVE: await params
    const { slug } = await context.params;

    const body = await req.json();

    const business = await prisma.business.update({
      where: { slug },
      data: {
        name: body.name,
        goal: body.goal,
        earnStep: body.earnStep,
        limitMode: body.limitMode,
        redeemMode: body.redeemMode,
      },
    });

    return NextResponse.json(business);
  } catch (err) {
    console.error("❌ Settings update error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
