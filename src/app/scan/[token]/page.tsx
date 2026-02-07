// src/app/scan/[token]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type CardData = {
  id: number;
  visits: number;
  goal: number;
  status: "ACTIVE" | "READY" | "REDEEMED";
  customer: {
    name: string;
  };
};

export default function ScanPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");

  const { token } = useParams<{ token: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Cargar tarjeta
  useEffect(() => {
    fetch(`/api/cards/${token}`)
      .then((r) => r.json())
      .then(setCard);
  }, [token]);

  // 🔹 Sumar visita
  async function addVisit() {
    if (!card) return;

    setLoading(true);
    setMessage(null);

    const res = await fetch(`/api/scan/${token}`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Error");
    } else {
      setCard(data.card);
      if (data.card.status === "READY") {
        setMessage("🎉 Tarjeta lista para canje");
      }
    }

    setLoading(false);
  }

  // 🔹 Canjear premio
  async function redeem() {
    if (!card) return;

    setLoading(true);
    setMessage(null);

    const res = await fetch(`/api/redeem/${token}`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Error al canjear");
    } else {
      setCard(data.card ?? { ...card, status: "REDEEMED" });
      setMessage("🎁 Premio canjeado correctamente");
    }

    setLoading(false);
  }

  // 🔐 Desbloquear caja con PIN
  async function unlockBox() {
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/box/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, pin }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "PIN incorrecto");
    } else {
      setUnlocked(true);
      setMessage("🔓 Caja desbloqueada");
    }

    setLoading(false);
  }

  if (!card) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando tarjeta...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold text-center">{card.customer.name}</h1>

        <p className="mt-2 text-center text-gray-600">
          Visitas: {card.visits} / {card.goal}
        </p>

        {/* 🔹 Mensajes */}
        {message && (
          <p className="mt-3 text-center font-medium text-green-600">
            {message}
          </p>
        )}

        {/* 🔹 Estado READY */}
        {card.status === "READY" && (
          <div className="mt-3 rounded-md bg-green-100 p-3 text-center text-green-700">
            🎉 Premio disponible para canje
          </div>
        )}

        {/* 🔹 Estado REDEEMED */}
        {card.status === "REDEEMED" && (
          <div className="mt-3 rounded-md bg-gray-200 p-3 text-center text-gray-700">
            ✅ Premio ya canjeado
          </div>
        )}
        {/* 🔐 PIN de caja */}
        {!unlocked && (
          <div className="mt-4 rounded-md border p-4">
            <p className="mb-2 text-center font-medium">
              🔐 Ingresar PIN de caja
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded border px-3 py-2 text-center text-lg"
              placeholder="••••"
            />

            <button
              onClick={unlockBox}
              disabled={loading || pin.length < 4}
              className="mt-3 w-full rounded bg-black py-2 text-white disabled:opacity-50"
            >
              Desbloquear
            </button>
          </div>
        )}

        {/* 🔹 Botón sumar visita */}
        <button
          onClick={addVisit}
          disabled={!unlocked || loading || card.status !== "ACTIVE"}
          className="mt-6 w-full rounded-md bg-black py-3 text-white disabled:opacity-50"
        >
          {loading ? "Procesando..." : "➕ Sumar visita"}
        </button>

        {/* 🔹 Botón canjear */}
        {card.status === "READY" && unlocked && (
          <button
            onClick={redeem}
            disabled={loading}
            className="mt-3 w-full rounded-md bg-green-600 py-3 text-white"
          >
            🎁 Canjear premio
          </button>
        )}
      </div>
    </main>
  );
}
