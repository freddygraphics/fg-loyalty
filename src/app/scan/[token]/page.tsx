"use client";

import { use, useEffect, useState } from "react";
import QRCode from "react-qr-code";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

type CardData = {
  customerName: string;
  businessName: string;
  points: number;
  goal: number;
};

export default function ScanPage({ params }: PageProps) {
  const { token } = use(params);

  const [data, setData] = useState<CardData | null | undefined>(undefined);

  useEffect(() => {
    async function loadCard() {
      try {
        const res = await fetch(`/api/scan/${token}`);

        if (!res.ok) {
          setData(null);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading card", err);
        setData(null);
      }
    }

    loadCard();
  }, [token]);

  // 🟢 OPCIÓN A: NO MOSTRAR NADA MIENTRAS CARGA
  if (data === undefined) {
    return null;
  }

  // ❌ Tarjeta no existe
  if (data === null) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Card not found</p>
      </main>
    );
  }

  const missing = Math.max(data.goal - data.points, 0);
  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/scan/${token}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow text-center space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold">{data.businessName}</h1>

        <p className="text-sm text-gray-600">{data.customerName}</p>

        <QRCode value={cardUrl} size={200} />

        <div className="text-sm">
          <p>
            ⭐ Points: <strong>{data.points}</strong>
          </p>
          <p className="text-gray-500">🎁 {missing} points to reward</p>
        </div>
      </div>
    </main>
  );
}
