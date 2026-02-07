"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ScanPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [token, setToken] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1️⃣ Verificar PIN
      const res = await fetch(`/api/business/${slug}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "PIN inválido");
        setLoading(false);
        return;
      }

      // 2️⃣ PIN OK → ir al siguiente paso (sumar puntos)
      router.push(`/business/${slug}/card/${token}`);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-xl shadow p-6"
      >
        <h1 className="text-xl font-bold text-center mb-4">Escanear tarjeta</h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* Token del QR */}
        <input
          type="text"
          placeholder="Escanea el QR"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        {/* PIN */}
        <input
          type="password"
          placeholder="PIN del negocio"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
