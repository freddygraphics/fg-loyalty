import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/getBusinessSession";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // validar sesión
    const session = await getBusinessSession();

    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // buscar negocio
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

    // 🔥 VALIDACIÓN CLAVE
    if (business.id !== session.businessId) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
    // buscar customers
    const customers = await prisma.customer.findMany({
      where: {
        businessId: business.id,
      },
      include: {
        cards: {
          include: {
            transactions: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // formato para el dashboard
    const data = customers.map((c) => {
      const card = c.cards[0];
      const lastTx = card?.transactions?.[0] ?? null;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        points: card?.points ?? 0,
        lastScan: lastTx?.createdAt ?? null,
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("CUSTOMERS API ERROR:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
