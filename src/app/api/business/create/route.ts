export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, slug, goal, earnStep, limitMode, redeemMode, userId } = body;

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
        goal: goal ?? 10,
        earnStep: earnStep ?? 1,
        limitMode: limitMode ?? "cap",
        redeemMode: redeemMode ?? "subtract",
        ownerId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      businessId: business.id,
      slug: business.slug,
    });
  } catch (error: unknown) {
    console.error("❌ CREATE BUSINESS ERROR:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
