export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    const { ownerName, email, password, businessName, pin, goal, earnStep } =
      await req.json();

    if (!ownerName || !email || !password || !businessName || !pin) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const pinHash = await bcrypt.hash(pin, 10);
    const slug = slugify(businessName);

    // Crear usuario + negocio en transacción
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: ownerName,
          email,
          password: passwordHash,
        },
      });

      const business = await tx.business.create({
        data: {
          name: businessName,
          slug,
          ownerId: user.id,
          goal: goal ?? 50,
          earnStep: earnStep ?? 5,
          limitMode: "cap",
          redeemMode: "reset",
          pinHash,
        },
      });

      return { user, business };
    });

    // 👉 Aquí luego pondremos la sesión
    return NextResponse.json({
      success: true,
      businessSlug: result.business.slug,
    });
  } catch (error: any) {
    console.error("❌ REGISTER ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email o negocio ya existe" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

