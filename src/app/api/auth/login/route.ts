import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

const ownerLoginSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
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
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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
        { error: "Business not found for this account" },
        { status: 404 },
      );
    }

    const res = NextResponse.json({
      success: true,
      redirectTo: `https://app.getfideliza.com/business/${business.slug}/dashboard`,
    });

    // COOKIE PRO para subdominios
    res.cookies.set("userId", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: ".getfideliza.com", // 🔥 importante
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
