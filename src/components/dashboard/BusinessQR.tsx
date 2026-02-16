"use client";

import QRCode from "react-qr-code";

export default function BusinessQR({ slug }: { slug: string }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/${slug}`
      : "";

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        QR para Clientes
      </h3>

      <div className="flex flex-col items-center gap-4">
        {url && <QRCode value={url} size={180} />}

        <p className="text-xs text-gray-500 text-center">
          Escanea para unirte al programa de puntos
        </p>

        <button
          onClick={() => navigator.clipboard.writeText(url)}
          className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
        >
          Copiar enlace
        </button>
      </div>
    </div>
  );
}
