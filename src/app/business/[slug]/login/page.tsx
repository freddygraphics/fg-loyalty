"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BusinessLoginPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/business/${slug}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "PIN incorrecto");
      setLoading(false);
      return;
    }

    router.push(`/business/${slug}/dashboard`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center mb-4">
          Acceso del negocio
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="PIN"
          className="w-full border p-3 rounded mb-4 text-center tracking-widest"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
