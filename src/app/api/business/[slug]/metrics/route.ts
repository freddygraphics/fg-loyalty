import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const slug = params.slug;

    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      return NextResponse.json(
        { error: "BUSINESS_NOT_FOUND" },
        { status: 404 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scansToday = await prisma.pointTransaction.count({
      where: {
        businessId: business.id,
        createdAt: { gte: today },
        type: "earn",
      },
    });

    const pointsToday = await prisma.pointTransaction.aggregate({
      where: {
        businessId: business.id,
        createdAt: { gte: today },
        type: "earn",
      },
      _sum: { points: true },
    });

    const customers = await prisma.customer.count({
      where: { businessId: business.id },
    });

    const recentActivity = await prisma.pointTransaction.findMany({
      where: {
        businessId: business.id, // 🔐 solo este negocio
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        card: {
          include: {
            customer: true,
          },
        },
      },
    });

    return NextResponse.json({
      scansToday,
      pointsToday: pointsToday._sum.points || 0,
      customers,
      goal: business.goal,
      recentActivity: recentActivity.map((tx) => ({
        id: tx.id,
        customerName: tx.card.customer.name,
        points: tx.points,
        createdAt: tx.createdAt,
      })),
    });
  } catch (err) {
    console.error("METRICS ERROR", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
