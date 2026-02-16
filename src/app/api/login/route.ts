import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

const ownerLoginSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  password: true,
  businesses: {
    select: {
      id: true,
      slug: true,
    },
  },
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: ownerLoginSelect,
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const business = user.businesses?.[0];

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    const res = NextResponse.json({
      success: true,
      businessId: business.id,
      slug: business.slug,
    });

    res.cookies.set("owner_session", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("❌ Login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
