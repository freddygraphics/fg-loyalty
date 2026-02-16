import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: {
    params: Promise<{ slug: string; id: string }>;
  },
) {
  try {
    const { slug, id } = await context.params;

    if (!slug || !id) {
      return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: "BUSINESS_NOT_FOUND" },
        { status: 404 },
      );
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id, // 👈 STRING, no Number()
        businessId: business.id,
      },
      include: {
        cards: {
          include: {
            transactions: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "CUSTOMER_NOT_FOUND" },
        { status: 404 },
      );
    }

    const card = customer.cards[0];

    return NextResponse.json({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      points: card?.points ?? 0,
      history:
        card?.transactions.map((t) => ({
          id: t.id,
          type: t.type,
          points: t.points,
          createdAt: t.createdAt,
          note: t.note,
        })) ?? [],
    });
  } catch (err) {
    console.error("CUSTOMER DETAIL ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
