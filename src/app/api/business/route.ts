import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, goal, ownerId, earnStep, limitMode, redeemMode } = body;

    if (!name || !slug || !ownerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        goal: Number(goal) || 10,
        earnStep: Number(earnStep) || 1,
        limitMode: limitMode || "cap",
        redeemMode: redeemMode || "subtract",

        owner: {
          connect: { id: ownerId }, // 👈 STRING
        },
      },
    });

    return NextResponse.json(business);
  } catch (err) {
    console.error("❌ Create business error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
