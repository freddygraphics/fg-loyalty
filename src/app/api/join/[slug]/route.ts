import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";

// 🔐 Genera token único para QR
async function generateUniqueToken(): Promise<string> {
  let token: string;

  do {
    token = crypto.randomBytes(6).toString("hex").toUpperCase();
  } while (
    await prisma.loyaltyCard.findUnique({
      where: { token },
    })
  );

  return token;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    let { name, phone, email } = body as {
      name?: string;
      phone?: string;
      email?: string;
    };

    // ✅ Validación
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 },
      );
    }

    // ✅ Normalizar teléfono
    phone = phone.replace(/\D/g, "");

    // 1️⃣ Buscar negocio
    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // 2️⃣ Buscar cliente existente + tarjetas
    const existing = await prisma.customer.findFirst({
      where: {
        businessId: business.id,
        phone,
      },
      include: {
        cards: true, // ✅ coincide con schema
      },
    });

    // 🔁 Si ya existe, devolver su tarjeta
    if (existing?.cards?.length) {
      const card = existing.cards[0];

      return NextResponse.json({
        success: true,
        customerId: existing.id,
        cardToken: card.token,
        points: card.points,
        duplicated: true,
      });
    }

    // 3️⃣ Crear cliente
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email,
        businessId: business.id,
      },
    });

    // 4️⃣ Crear tarjeta
    const card = await prisma.loyaltyCard.create({
      data: {
        token: await generateUniqueToken(),
        customerId: customer.id,
        businessId: business.id,
        points: 0,
      },
    });

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      cardToken: card.token,
      points: card.points,
    });
  } catch (error) {
    console.error("❌ JOIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
