// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Fideliza...");

  // 1️⃣ Crear usuario dueño
  const owner = await prisma.user.create({
    data: {
      name: "Demo Owner",
      email: "owner@demo.com",
      password: "hashed-password",
    },
  });

  // 2️⃣ Crear negocio
  const business = await prisma.business.create({
    data: {
      name: "Demo Coffee Shop",
      slug: "demo-coffee",
      ownerId: owner.id,
      goal: 10,
      earnStep: 1,
      limitMode: "cap",
      redeemMode: "reset",
    },
  });

  // 3️⃣ Crear cliente
  const customer = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Juan Perez",
      phone: "5551234567",
    },
  });

  // 4️⃣ Crear tarjeta con QR
  const card = await prisma.loyaltyCard.create({
    data: {
      businessId: business.id,
      customerId: customer.id,
      token: "E48FA269705D",
      points: 0,
      active: true,
    },
  });

  console.log("✅ Seed completado");
  console.log("🏪 Business:", business.name);
  console.log("👤 Customer:", customer.name);
  console.log("🔑 QR Token:", card.token);
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
