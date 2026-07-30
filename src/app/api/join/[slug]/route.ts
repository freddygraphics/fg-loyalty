export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";

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

    // ✅ USAR CONST (no se reasignan)
    const { name, phone, email } = body as {
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

    // ✅ Normalizar teléfono (aquí sí creamos variable nueva)
    const normalizedPhone = phone.replace(/\D/g, "");

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

    // 2️⃣ Buscar cliente existente
    const existing = await prisma.customer.findFirst({
      where: {
        businessId: business.id,
        phone: normalizedPhone,
      },
      include: {
        cards: true,
      },
    });

    // 🔁 Cliente duplicado → devolver su QR
    // ❌ El teléfono ya está registrado
    if (existing) {
      return NextResponse.json(
        {
          error: "PHONE_ALREADY_REGISTERED",
        },
        {
          status: 409,
        },
      );
    }

    // 3️⃣ Crear cliente
    const customer = await prisma.customer.create({
      data: {
        name,
        phone: normalizedPhone,
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
      customerName: customer.name,
      cardToken: card.token,
      points: card.points,
      duplicated: false,
    });
  } catch (error) {
    console.error("❌ JOIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
