import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      goal: true,
    },
  });

  if (!business) {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(business);
}
