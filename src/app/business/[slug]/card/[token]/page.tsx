"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type CardData = {
  token: string;
  points: number;
  goal: number;
  customerName: string;
  businessName: string;
};

export default function BusinessCardPage() {
  const [history, setHistory] = useState<any[]>([]);

  const { slug, token } = useParams<{
    slug: string;
    token: string;
  }>();

  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug || !token) return;

    fetch(`/api/business/${slug}/card/${token}/history`)
      .then((res) => res.json())
      .then(setHistory);
  }, [slug, token]);

  useEffect(() => {
    if (!token || !slug) return;

    fetch(`/api/business/${slug}/card/${token}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, token]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!data || (data as any).error) {
    return (
      <div className="flex h-screen items-center justify-center">
        Tarjeta no encontrada
      </div>
    );
  }
  async function earnPoints(amount: number) {
    const res = await fetch(`/api/business/${slug}/card/${token}/earn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: amount }),
    });

    const json = await res.json();

    if (res.ok) {
      setData((prev) => (prev ? { ...prev, points: json.newPoints } : prev));
    } else {
      alert(json.error || "Error al sumar puntos");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-6">
        <h1 className="text-xl font-bold text-center mb-1">
          {data.businessName}
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Cliente: {data.customerName}
        </p>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold">{data.points}</div>
          <div className="text-sm text-gray-500">puntos / {data.goal}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => earnPoints(5)}
            className="bg-black text-white py-3 rounded font-medium"
          >
            +5 puntos
          </button>

          <button
            onClick={async () => {
              const res = await fetch(
                `/api/business/${slug}/card/${token}/redeem`,
                { method: "POST" },
              );

              const json = await res.json();

              if (res.ok) {
                setData((prev) =>
                  prev ? { ...prev, points: json.newPoints } : prev,
                );
                alert("🎉 Recompensa redimida");
              } else {
                alert(json.error || "No se pudo redimir");
              }
            }}
            className="border py-3 rounded font-medium"
          >
            🎁 Redimir
          </button>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Historial</h3>

            {history.length === 0 && (
              <p className="text-sm text-gray-500">Sin movimientos</p>
            )}

            <ul className="space-y-2">
              {history.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between text-sm border-b pb-1"
                >
                  <span>
                    {tx.type === "earn" && "➕"}
                    {tx.type === "redeem" && "🎁"}
                    {tx.type === "adjust" && "✏️"} {tx.note || tx.type}
                  </span>

                  <span
                    className={
                      tx.points > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {tx.points > 0 ? "+" : ""}
                    {tx.points}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
