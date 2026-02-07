// src/app/b/[slug]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function RegisterPage() {
  const { slug } = useParams<{ slug: string }>();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletUrl, setWalletUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          businessSlug: slug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setWalletUrl(`/card/${data.token}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-center">
          Tarjeta de Fidelización
        </h1>

        <p className="mt-2 text-center text-sm text-gray-600">
          Regístrate y guarda tu tarjeta en tu teléfono
        </p>

        {!walletUrl ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Teléfono o Email
              </label>
              <input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="juan@email.com"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Crear mi tarjeta"}
            </button>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <p className="mb-4 text-sm text-gray-700">
              ¡Listo! Guarda tu tarjeta digital:
            </p>

            <a
              href={walletUrl}
              className="inline-block rounded-md bg-black px-6 py-3 text-white"
            >
              📱 Ver mi tarjeta
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
