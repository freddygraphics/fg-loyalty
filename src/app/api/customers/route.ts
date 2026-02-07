import prisma from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const { businessSlug, name, contact } = await req.json();

  if (!businessSlug || !name) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
  });

  if (!business) {
    return Response.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      contact: contact || "",
    },
  });

  const token = crypto.randomBytes(4).toString("hex").toUpperCase();

  const card = await prisma.loyaltyCard.create({
    data: {
      token,
      goal: business.goal,
      businessId: business.id,
      customerId: customer.id,
    },
  });

  return Response.json({
    customer,
    card,
    scanUrl: `/scan/${card.token}`,
  });
}
