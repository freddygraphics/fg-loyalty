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

  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/scan/${token}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading card…
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Card not found
      </main>
    );
  }

  const missing = Math.max(data.goal - data.points, 0);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow text-center space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold">{data.businessName}</h1>

        <p className="text-sm text-gray-600">{data.customerName}</p>

        <QRCode
          value={`${process.env.NEXT_PUBLIC_APP_URL}/scan/${token}`}
          size={200}
        />

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
