"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";

type CardData = {
  token: string;
  points: number;
  goal: number;
  customerName: string;
  businessName: string;
};

export default function ClientCardPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/card/${token}`)
      .then((res) => res.json())
      .then((json: CardData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (!token || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        Tarjeta no encontrada
      </div>
    );
  }

  const progress = Math.min(100, Math.round((data.points / data.goal) * 100));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-1">{data.businessName} Rewards</h1>

      <p className="text-sm text-gray-600 mb-4">Cliente: {data.customerName}</p>

      {/* QR */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <QRCode value={data.token} size={220} />
      </div>

      {/* Puntos */}
      <div className="bg-white w-full max-w-sm rounded-xl shadow p-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Puntos</span>
          <span className="font-bold">
            {data.points} / {data.goal}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-black h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Muestra este QR en cada compra
        </p>
      </div>
    </div>
  );
}
