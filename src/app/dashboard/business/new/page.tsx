"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBusinessPage() {
  const router = useRouter();

  // ⚠️ TEMPORAL para pruebas
  const userId = 1;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    pin: "",
    goal: 50,
    earnStep: 5,
    limitMode: "cap",
    redeemMode: "reset",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/business/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error creating business");
        setLoading(false);
        return;
      }

      router.push(`/business/${data.slug}/scan`);
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear nuevo negocio</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Nombre del negocio"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />

        <input
          placeholder="Slug (ej: freddy-graphics)"
          className="w-full border p-2 rounded"
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          required
        />

        <input
          placeholder="PIN del negocio"
          type="password"
          className="w-full border p-2 rounded"
          value={form.pin}
          onChange={(e) => updateField("pin", e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="border p-2 rounded"
            value={form.goal}
            onChange={(e) => updateField("goal", Number(e.target.value))}
          />
          <input
            type="number"
            className="border p-2 rounded"
            value={form.earnStep}
            onChange={(e) => updateField("earnStep", Number(e.target.value))}
          />
        </div>

        <select
          className="border p-2 rounded w-full"
          value={form.limitMode}
          onChange={(e) => updateField("limitMode", e.target.value)}
        >
          <option value="cap">No permitir pasar del límite</option>
          <option value="overflow">Permitir acumular puntos</option>
        </select>

        <select
          className="border p-2 rounded w-full"
          value={form.redeemMode}
          onChange={(e) => updateField("redeemMode", e.target.value)}
        >
          <option value="reset">Reiniciar a 0 al redimir</option>
          <option value="subtract">Restar meta</option>
        </select>

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear negocio"}
        </button>
      </form>
    </div>
  );
}
