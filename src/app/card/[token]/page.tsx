import prisma from "@/lib/db";

import QRCode from "react-qr-code";

export default async function CardPage({
  params,
}: {
  params: { token: string };
}) {
  const card = await prisma.loyaltyCard.findUnique({
    where: { token: params.token },
    include: {
      customer: true,
      business: true,
    },
  });

  if (!card) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Tarjeta no encontrada</p>
      </main>
    );
  }

  const scanUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/scan/${card.token}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-black p-6 text-white shadow-xl">
        {/* 🔹 Negocio */}
        <h1 className="text-xl font-bold text-center">{card.business.name}</h1>

        {/* 🔹 Cliente */}
        <p className="mt-1 text-center text-sm opacity-80">
          {card.customer.name}
        </p>

        {/* 🔹 QR */}
        <div className="my-6 flex justify-center bg-white p-3 rounded-lg">
          <QRCode value={scanUrl} size={160} />
        </div>

        {/* 🔹 Progreso */}
        <p className="text-center text-lg font-semibold">
          {card.visits} / {card.goal} visitas
        </p>

        {/* 🔹 ESTADO READY */}
        {card.status === "READY" && (
          <div className="mt-3 rounded bg-green-600/20 p-2 text-center text-sm">
            🎉 ¡Premio listo! Muéstralo en caja para canjear
          </div>
        )}

        {/* 🔹 ESTADO REDEEMED */}
        {card.status === "REDEEMED" && (
          <div className="mt-3 rounded bg-gray-600/20 p-2 text-center text-sm">
            ✅ Premio ya canjeado
          </div>
        )}

        {/* 🔹 Instrucción */}
        <p className="mt-4 text-center text-xs opacity-70">
          Muestra este código en caja
        </p>

        {/* 🔹 Guardar en Home Screen */}
        <div className="mt-4 rounded-lg bg-white/10 p-3 text-center text-sm">
          📱 Para guardar: toca <b>Compartir</b> →{" "}
          <b>Añadir a pantalla de inicio</b>
        </div>
      </div>
    </main>
  );
}
