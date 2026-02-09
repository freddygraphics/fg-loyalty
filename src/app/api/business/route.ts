import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, goal, ownerId, pin } = body;

    if (!name || !slug || !ownerId || !pin) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        goal: Number(goal) || 10,

        // ✅ RELACIÓN CORRECTA
        owner: {
          connect: { id: Number(ownerId) },
        },

        // ✅ CAMPO OBLIGATORIO
        pinHash,
      },
    });

    return NextResponse.json(business);
  } catch (err) {
    console.error("❌ Create business error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
