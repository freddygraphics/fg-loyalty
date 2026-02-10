import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  try {
    // ✅ Next strict: params es Promise
    const { slug } = await context.params;

    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        customers: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            card: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      scansToday: 0, // TODO: calcular por fecha
      pointsToday: 0, // TODO: sumar puntos por fecha
      customers: business.customers.length,
      goal: business.goal,
      recentActivity: business.transactions.map((t) => ({
        id: t.id,
        customerName: t.card.customer.name,
        points: t.points,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    console.error("❌ Metrics error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
