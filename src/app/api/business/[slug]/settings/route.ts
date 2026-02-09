import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const body = await req.json();

  const business = await prisma.business.update({
    where: { slug: params.slug },
    data: {
      goal: body.goal,
      earnStep: body.earnStep,
      limitMode: body.limitMode,
      redeemMode: body.redeemMode,
    },
  });

  return NextResponse.json(business);
}
