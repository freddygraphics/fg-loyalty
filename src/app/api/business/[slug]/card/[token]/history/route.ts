export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string; token: string }> },
) {
  try {
    // 🔑 await params
    const { slug, token } = await context.params;

    const card = await prisma.loyaltyCard.findFirst({
      where: {
        token,
        business: { slug },
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Tarjeta no encontrada" },
        { status: 404 },
      );
    }

    const tx = await prisma.pointTransaction.findMany({
      where: {
        cardId: card.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tx);
  } catch (error) {
    console.error("❌ HISTORY ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
