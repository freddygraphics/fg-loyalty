import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

async function getAuthorizedBusiness(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const session = verifySessionToken(token);

  if (!session) return null;

  return prisma.business.findFirst({
    where: {
      id: session.businessId,
      slug,
      ownerId: session.userId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      businessEmail: true,
      phone: true,
      website: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
    },
  });
}

// Obtener información del negocio
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const business = await getAuthorizedBusiness(slug);

    if (!business) {
      return NextResponse.json(
        { error: "Business not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("ACCOUNT GET ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Guardar información del negocio
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const business = await getAuthorizedBusiness(slug);

    if (!business) {
      return NextResponse.json(
        { error: "Business not found or unauthorized" },
        { status: 404 },
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const businessEmail = String(body.businessEmail ?? "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const website = String(body.website ?? "").trim();
    const address = String(body.address ?? "").trim();
    const city = String(body.city ?? "").trim();
    const state = String(body.state ?? "").trim();
    const zipCode = String(body.zipCode ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 },
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Business name is too long" },
        { status: 400 },
      );
    }

    if (businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      return NextResponse.json(
        { error: "Enter a valid business email" },
        { status: 400 },
      );
    }

    const updatedBusiness = await prisma.business.update({
      where: {
        id: business.id,
      },
      data: {
        name,
        businessEmail: businessEmail || null,
        phone: phone || null,
        website: website || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        businessEmail: true,
        phone: true,
        website: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
      },
    });

    return NextResponse.json({
      message: "Business information updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("ACCOUNT PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
