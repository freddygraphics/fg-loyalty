import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { TxType } from "@prisma/client";
import { verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // =========================================================
    // 1. Validar sesión enviada por la aplicación
    // =========================================================
    const authorization = req.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "").trim();
    const session = verifySessionToken(token);

    if (!session?.businessId) {
      return Response.json({ error: "INVALID_SESSION" }, { status: 401 });
    }

    // =========================================================
    // 2. Validar contenido recibido
    // =========================================================
    const body = await req.json();
    const qr = String(body?.qr || "").trim();

    if (!qr) {
      return Response.json({ error: "QR_REQUIRED" }, { status: 400 });
    }

    // =========================================================
    // 3. Procesar escaneo
    // =========================================================
    const result = await prisma.$transaction(async (tx) => {
      const card = await tx.loyaltyCard.findUnique({
        where: {
          token: qr,
        },
        include: {
          business: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!card) {
        throw new Error("INVALID_QR");
      }

      const business = card.business;

      // El empleado solo puede escanear tarjetas de su negocio
      if (business.id !== session.businessId) {
        throw new Error("QR_NOT_FROM_THIS_BUSINESS");
      }

      if (!business.earnStep || business.earnStep <= 0) {
        throw new Error("EARN_STEP_NOT_DEFINED");
      }

      if (!business.goal || business.goal <= 0) {
        throw new Error("GOAL_NOT_DEFINED");
      }

      // Evitar escaneos repetidos muy rápidos
      if (card.lastScanAt) {
        const millisecondsSinceLastScan =
          Date.now() - card.lastScanAt.getTime();

        if (millisecondsSinceLastScan < 3000) {
          throw new Error("SCAN_TOO_FAST");
        }
      }

      let pointsToAdd = business.earnStep;
      let reachedGoal = false;

      // =======================================================
      // Limit mode: cap
      // =======================================================
      if (business.limitMode === "cap") {
        if (card.points >= business.goal) {
          throw new Error("GOAL_REACHED");
        }

        if (card.points + pointsToAdd >= business.goal) {
          pointsToAdd = business.goal - card.points;
          reachedGoal = true;
        }
      } else {
        reachedGoal = card.points + pointsToAdd >= business.goal;
      }

      // =======================================================
      // Actualizar puntos
      // =======================================================
      const updatedCard = await tx.loyaltyCard.update({
        where: {
          id: card.id,
        },
        data: {
          points: card.points + pointsToAdd,
          lastScanAt: new Date(),
        },
      });

      // =======================================================
      // Registrar movimiento para el historial
      // =======================================================
      await tx.pointTransaction.create({
        data: {
          businessId: business.id,
          cardId: card.id,
          type: TxType.EARN,
          points: pointsToAdd,
          note: "Scan earn",
        },
      });

      let totalPoints = updatedCard.points;
      const redeemed = reachedGoal && business.redeemMode === "reset";

      // =======================================================
      // Redeem mode: reset
      // =======================================================
      if (redeemed) {
        await tx.loyaltyCard.update({
          where: {
            id: card.id,
          },
          data: {
            points: 0,
          },
        });

        totalPoints = 0;
      }

      return {
        customerName: card.customer.name,
        pointsAdded: pointsToAdd,
        totalPoints,
        reachedGoal,
        redeemed,
      };
    });

    return Response.json({
      ok: true,
      ...result,
    });
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
        "QR_NOT_FROM_THIS_BUSINESS",
      ].includes(error)
    ) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
