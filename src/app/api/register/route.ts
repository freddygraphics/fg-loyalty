import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ✅ TIPOS PRO (CLAVE)
const createOwnerData = Prisma.validator<Prisma.UserCreateInput>()({
  name: "",
  email: "",
  passwordHash: "",
});

const createBusinessData = Prisma.validator<Prisma.BusinessCreateInput>()({
  name: "",
  slug: "",
  pinHash: "",
  owner: {
    connect: { id: 0 },
  },
});

export async function POST(req: Request) {
  try {
    const { name, email, password, businessName } = await req.json();

    if (!name || !email || !password || !businessName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const pin = generatePin();
    const pinHash = await bcrypt.hash(pin, 10);
    const slug = slugify(businessName);

    // 👤 OWNER
    const owner = await prisma.user.create({
      data: {
        ...createOwnerData,
        name,
        email,
        passwordHash,
      },
    });

    // 🏪 BUSINESS
    const business = await prisma.business.create({
      data: {
        ...createBusinessData,
        name: businessName,
        slug,
        pinHash,
        owner: {
          connect: { id: owner.id },
        },
      },
    });

    return NextResponse.json({
      success: true,
      slug: business.slug,
      pin, // 👈 muéstralo UNA SOLA VEZ
    });
  } catch (err) {
    console.error("❌ Register error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
