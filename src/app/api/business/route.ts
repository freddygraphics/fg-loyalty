import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, slug, goal, userId } = await req.json();

    if (!name || !slug || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        goal: Number(goal) || 10,

        // ✅ OBLIGATORIO
        ownerId: userId,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("❌ CREATE BUSINESS ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
