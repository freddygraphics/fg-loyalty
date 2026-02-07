import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ownerId = 1;

    const { name, slug, pin, goal, earnStep, limitMode, redeemMode } = req.body;

    if (!name || !slug || !pin) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const business = await prisma.business.create({
      data: {
        name,
        slug,
        pinHash,
        goal,
        earnStep,
        limitMode,
        redeemMode,
        ownerId,
      },
    });

    return res.status(201).json(business);
  } catch (error) {
    console.error("❌ Error creando business:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
