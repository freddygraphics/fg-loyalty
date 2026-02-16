export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const form = await req.formData();

  const businessId = form.get("businessId") as string;
  const goal = Number(form.get("goal"));
  const earnStep = Number(form.get("earnStep"));
  const limitMode = form.get("limitMode") as "cap" | "overflow";
  const redeemMode = form.get("redeemMode") as "reset" | "subtract";

  if (!businessId) {
    return NextResponse.json({ error: "Missing business" }, { status: 400 });
  }

  await prisma.business.update({
    where: { id: businessId }, // 👈 STRING ahora
    data: {
      goal,
      earnStep,
      limitMode,
      redeemMode,
    },
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
