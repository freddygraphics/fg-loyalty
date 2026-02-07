"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBusinessPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [goal, setGoal] = useState(50);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/business/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, goal, pin }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(json.error || "Error al crear negocio");
      return;
    }

    router.push(`/business/${json.slug}/dashboard`);
  }

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Crear negocio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Meta de puntos</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            min={1}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">PIN del negocio</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            minLength={4}
            required
          />
        </div>

        <button
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded"
        >
          {loading ? "Creando..." : "Crear negocio"}
        </button>
      </form>
    </div>
  );
}
