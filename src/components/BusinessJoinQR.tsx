"use client";

import QRCode from "react-qr-code";

export default function BusinessJoinQR({ slug }: { slug: string }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="font-semibold mb-3">QR para registrar clientes</h3>

      <div className="flex justify-center">
        <QRCode
          value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${slug}`}
          size={180}
        />
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Los clientes escanean este código para unirse
      </p>
    </div>
  );
}
