import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    // ✅ CLAVE PARA VERCEL
    const { slug } = await context.params;

    const transactions = await prisma.pointTransaction.findMany({
      where: {
        business: {
          slug,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        card: {
          include: {
            customer: true,
          },
        },
      },
    });

    return NextResponse.json(
      transactions.map((tx) => ({
        id: tx.id,
        customerName: tx.card.customer.name,
        points: tx.points,
        type: tx.type,
        createdAt: tx.createdAt,
      })),
    );
  } catch (err) {
    console.error("❌ Transactions error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
