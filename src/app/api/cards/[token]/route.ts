export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import prisma from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;

  const card = await prisma.loyaltyCard.findUnique({
    where: { token },
    include: {
      customer: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}
