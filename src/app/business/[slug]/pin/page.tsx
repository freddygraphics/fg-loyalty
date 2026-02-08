"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SetPinPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (pin !== confirm) {
      setError("Los PIN no coinciden");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/business/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, pin }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al guardar PIN");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // 👉 luego podemos redirigir a dashboard
    setTimeout(() => {
      router.push(`/scan/DEMO123`);
    }, 1500);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-xl font-bold text-center">
          Configurar PIN de caja
        </h1>

        <p className="mt-1 text-center text-sm text-gray-600">
          Negocio: <strong>{slug}</strong>
        </p>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}

        {success && (
          <p className="mt-3 text-center text-sm text-green-600">
            ✅ PIN configurado correctamente
          </p>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium">PIN de caja</label>
          <input
            type="password"
            inputMode="numeric"
            className="mt-1 w-full rounded border px-3 py-2 text-center tracking-widest"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Confirmar PIN</label>
          <input
            type="password"
            inputMode="numeric"
            className="mt-1 w-full rounded border px-3 py-2 text-center tracking-widest"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-black py-3 text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar PIN"}
        </button>
      </form>
    </main>
  );
}
