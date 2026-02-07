"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBusinessPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [goal, setGoal] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, goal }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al crear negocio");
      setLoading(false);
      return;
    }

    // 👉 luego iremos a configurar el PIN
    router.push(`/business/${data.slug}/pin`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-xl font-bold text-center">Crear nuevo negocio</h1>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium">Nombre del negocio</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Café Central"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Slug (URL)</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="cafe-central"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Se usa para URLs y QR</p>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">
            Visitas necesarias para premio
          </label>
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded border px-3 py-2"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-black py-3 text-white disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear negocio"}
        </button>
      </form>
    </main>
  );
}
