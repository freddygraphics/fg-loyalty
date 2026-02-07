import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Running seed...");

  // 1️⃣ Crear usuario demo
  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      name: "Demo Owner",
      email: "demo@loyalty.com",
      password: passwordHash,
    },
  });

  // 2️⃣ Crear negocio demo (ligado al user)
  const pinHash = await bcrypt.hash("1234", 10);

  await prisma.business.create({
    data: {
      name: "Demo Business",
      slug: "demo-business",
      ownerId: user.id, // 👈 CLAVE
      goal: 50,
      earnStep: 5,
      limitMode: "cap",
      redeemMode: "reset",
      pinHash,
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
