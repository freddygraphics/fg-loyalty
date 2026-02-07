import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, phone, email, businessId } = await req.json();

    if (!name || !phone || !businessId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email: email || null,
        businessId,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    console.error("❌ CREATE CUSTOMER ERROR:", error);

    // Cliente duplicado por teléfono
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Customer already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
