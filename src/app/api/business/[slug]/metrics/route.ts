import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/getBusinessSession";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    const session = await getBusinessSession();

    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const business = await prisma.business.findFirst({
      where: {
        slug,
        id: session.businessId,
      },
      select: {
        id: true,
        goal: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    // 🕒 Inicio del día
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // 🔢 Clientes
    const customersCount = await prisma.customer.count({
      where: { businessId: business.id },
    });

    // 🔥 Scans hoy
    const scansToday = await prisma.pointTransaction.count({
      where: {
        businessId: business.id,
        createdAt: { gte: startOfDay },
      },
    });

    // 💰 Puntos hoy
    const pointsAgg = await prisma.pointTransaction.aggregate({
      _sum: { points: true },
      where: {
        businessId: business.id,
        createdAt: { gte: startOfDay },
      },
    });

    const pointsToday = pointsAgg._sum.points ?? 0;

    return NextResponse.json({
      scansToday,
      pointsToday,
      customers: customersCount,
      goal: business.goal,
    });
  } catch (err) {
    console.error("METRICS ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
