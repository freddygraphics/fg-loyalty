import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { TxType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qr } = body;

    // 1️⃣ Validar QR
    if (!qr || typeof qr !== "string") {
      return Response.json({ error: "QR_REQUIRED" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 2️⃣ Buscar tarjeta + negocio (LOCK LÓGICO)
      const card = await tx.loyaltyCard.findUnique({
        where: { token: qr },
        include: { business: true },
      });

      if (!card) {
        throw new Error("INVALID_QR");
      }

      const business = card.business;

      // 3️⃣ Validar configuración
      if (!business.earnStep || business.earnStep <= 0) {
        throw new Error("EARN_STEP_NOT_DEFINED");
      }

      if (!business.goal || business.goal <= 0) {
        throw new Error("GOAL_NOT_DEFINED");
      }

      // 4️⃣ Anti doble scan REAL (backend)
      if (card.lastScanAt) {
        const diff = Date.now() - card.lastScanAt.getTime();
        if (diff < 3000) {
          throw new Error("SCAN_TOO_FAST");
        }
      }

      let pointsToAdd = business.earnStep;
      let reachedGoal = false;

      // 5️⃣ Limit mode: CAP
      if (business.limitMode === "cap") {
        if (card.points >= business.goal) {
          throw new Error("GOAL_REACHED");
        }

        if (card.points + pointsToAdd >= business.goal) {
          pointsToAdd = business.goal - card.points;
          reachedGoal = true;
        }
      }

      // 6️⃣ Actualizar tarjeta (MISMA TRANSACCIÓN)
      const updatedCard = await tx.loyaltyCard.update({
        where: { id: card.id },
        data: {
          points: card.points + pointsToAdd,
          lastScanAt: new Date(),
        },
      });

      // 7️⃣ Registrar transacción
      await tx.pointTransaction.create({
        data: {
          businessId: business.id,
          cardId: card.id,
          type: TxType.EARN,

          points: pointsToAdd,
          note: "Scan earn",
        },
      });

      // 8️⃣ Redeem mode: RESET
      if (reachedGoal && business.redeemMode === "reset") {
        await tx.loyaltyCard.update({
          where: { id: card.id },
          data: { points: 0 },
        });
      }

      // 9️⃣ Resultado final
      return {
        pointsAdded: pointsToAdd,
        totalPoints:
          reachedGoal && business.redeemMode === "reset"
            ? 0
            : updatedCard.points,
        reachedGoal,
        redeemed: reachedGoal && business.redeemMode === "reset",
      };
    });

    return Response.json({ ok: true, ...result });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "UNKNOWN_ERROR";

    console.error("SCAN API ERROR:", error);

    if (
      [
        "INVALID_QR",
        "SCAN_TOO_FAST",
        "GOAL_REACHED",
        "EARN_STEP_NOT_DEFINED",
        "GOAL_NOT_DEFINED",
      ].includes(error)
    ) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
