import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qr } = body;

    // 1️⃣ Validar QR
    if (!qr || typeof qr !== "string") {
      return Response.json({ error: "QR_REQUIRED" }, { status: 400 });
    }

    // 2️⃣ Buscar tarjeta
    const card = await prisma.loyaltyCard.findUnique({
      where: { token: qr },
      include: {
        business: true,
      },
    });

    if (!card) {
      return Response.json({ error: "INVALID_QR" }, { status: 404 });
    }

    const business = card.business;

    // 3️⃣ Validar configuración
    if (!business.earnStep || business.earnStep <= 0) {
      return Response.json({ error: "EARN_STEP_NOT_DEFINED" }, { status: 400 });
    }

    if (!business.goal || business.goal <= 0) {
      return Response.json({ error: "GOAL_NOT_DEFINED" }, { status: 400 });
    }

    // 4️⃣ Anti doble scan (3 segundos)
    if (card.lastScanAt) {
      const diff = Date.now() - card.lastScanAt.getTime();
      if (diff < 3000) {
        return Response.json({ error: "SCAN_TOO_FAST" }, { status: 429 });
      }
    }

    let pointsToAdd = business.earnStep;
    let reachedGoal = false;

    // 5️⃣ Limit mode: CAP
    if (business.limitMode === "CAP") {
      if (card.points >= business.goal) {
        return Response.json({ error: "GOAL_REACHED" }, { status: 400 });
      }

      if (card.points + pointsToAdd >= business.goal) {
        pointsToAdd = business.goal - card.points;
        reachedGoal = true;
      }
    }

    // 6️⃣ Actualizar tarjeta
    await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: {
        points: card.points + pointsToAdd,
        lastScanAt: new Date(),
      },
    });

    // 7️⃣ Registrar transacción (MODELO CORRECTO)
    await prisma.pointTransaction.create({
      data: {
        businessId: business.id,
        cardId: card.id,
        type: "earn",
        points: pointsToAdd,
        note: "Scan earn",
      },
    });

    // 8️⃣ Redeem mode: RESET
    if (reachedGoal && business.redeemMode === "RESET") {
      await prisma.loyaltyCard.update({
        where: { id: card.id },
        data: { points: 0 },
      });
    }

    // 9️⃣ Respuesta clara para la app
    return Response.json({
      ok: true,
      pointsAdded: pointsToAdd,
      totalPoints:
        reachedGoal && business.redeemMode === "RESET"
          ? 0
          : card.points + pointsToAdd,
      reachedGoal,
      redeemed: reachedGoal && business.redeemMode === "RESET",
    });
  } catch (err) {
    console.error("SCAN API ERROR:", err);
    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
