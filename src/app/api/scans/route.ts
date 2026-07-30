import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // =========================================================
    // Validar sesión de la aplicación móvil
    // =========================================================
    const authorization = req.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const token = authorization.slice(7).trim();
    const session = verifySessionToken(token);

    if (!session?.businessId) {
      return Response.json({ error: "INVALID_SESSION" }, { status: 401 });
    }

    // =========================================================
    // Obtener últimos movimientos del negocio
    // =========================================================
    const transactions = await prisma.pointTransaction.findMany({
      where: {
        businessId: session.businessId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      select: {
        id: true,
        type: true,
        points: true,
        note: true,
        createdAt: true,

        card: {
          select: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    const scans = transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      points: transaction.points,
      note: transaction.note,
      createdAt: transaction.createdAt,

      customer: {
        id: transaction.card.customer.id,
        name: transaction.card.customer.name,
        phone: transaction.card.customer.phone,
      },
    }));

    return Response.json({
      ok: true,
      scans,
    });
  } catch (error) {
    console.error("SCANS GET ERROR:", error);

    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
