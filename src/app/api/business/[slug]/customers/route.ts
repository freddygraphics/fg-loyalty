import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getBusinessSession } from "@/lib/getBusinessSession";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const session = await getBusinessSession();

    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const business = await prisma.business.findFirst({
      where: {
        slug,
        id: session.businessId,
      },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const customers = await prisma.customer.findMany({
      where: { businessId: business.id },
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
      orderBy: { createdAt: "desc" },
    });

    const data = customers.map((c) => {
      const card = c.cards[0];
      const lastTx = card?.transactions?.[0] ?? null;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        points: card?.points ?? 0,
        lastScan: lastTx?.createdAt ?? null,
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("CUSTOMERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const session = await getBusinessSession();

    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();

    const business = await prisma.business.findFirst({
      where: {
        slug,
        id: session.businessId,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email ?? null,
        businessId: business.id,
      },
    });

    await prisma.loyaltyCard.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        points: 0,
      },
    });

    return NextResponse.json(customer);
  } catch (err) {
    console.error("CUSTOMERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
