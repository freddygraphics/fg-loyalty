import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    // 🔑 CLAVE: await params
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "INVALID_SLUG" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      return NextResponse.json([]);
    }

    const customers = await prisma.customer.findMany({
      where: { businessId: business.id },
      include: {
        cards: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const data = await Promise.all(
      customers.map(async (c) => {
        const card = c.cards[0];

        const lastTx = card
          ? await prisma.pointTransaction.findFirst({
              where: { cardId: card.id },
              orderBy: { createdAt: "desc" },
            })
          : null;

        return {
          id: c.id,
          name: c.name,
          phone: c.phone,
          points: card?.points ?? 0,
          lastScan: lastTx?.createdAt ?? null,
        };
      }),
    );

    return NextResponse.json(data);
  } catch (err) {
    console.error("CUSTOMERS API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
