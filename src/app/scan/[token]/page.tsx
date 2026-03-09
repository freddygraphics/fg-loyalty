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
  const stars = Array.from({ length: data.goal });

  const missing = Math.max(data.goal - data.points, 0);
  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/scan/${token}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow text-center space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold">{data.customerName}</h1>

        <p className="text-sm text-gray-600">{data.businessName}</p>

        <div className="flex justify-center">
          <QRCode value={cardUrl} size={200} />
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {stars.map((_, index) => {
            const active = index < data.points;

            return (
              <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                  active ? "scale-110" : "opacity-70"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={active ? "url(#goldGradient)" : "none"}
                  stroke={active ? "none" : "#D1D5DB"}
                  strokeWidth="2"
                  className="w-8 h-8 drop-shadow-sm"
                >
                  <defs>
                    <linearGradient
                      id="goldGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2l2.9 6.1 6.7.6-5 4.3 1.5 6.5L12 16.8 5.9 19.5 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                </svg>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          🎁 {missing} point{missing !== 1 ? "s" : ""} to reward
        </p>
      </div>
    </main>
  );
}
