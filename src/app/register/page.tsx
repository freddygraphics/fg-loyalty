"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    password: "",
    businessName: "",
    pin: "",
    goal: 50,
    earnStep: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error al registrar");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-lg space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Registrar mi negocio</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}

        <input
          placeholder="Tu nombre"
          className="w-full border p-2 rounded"
          value={form.ownerName}
          onChange={(e) => update("ownerName", e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
        />

        <hr />

        <input
          placeholder="Nombre del negocio"
          className="w-full border p-2 rounded"
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="PIN del negocio (4 dígitos)"
          className="w-full border p-2 rounded"
          value={form.pin}
          onChange={(e) => update("pin", e.target.value)}
          minLength={4}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="border p-2 rounded"
            value={form.goal}
            onChange={(e) => update("goal", Number(e.target.value))}
          />
          <input
            type="number"
            className="border p-2 rounded"
            value={form.earnStep}
            onChange={(e) => update("earnStep", Number(e.target.value))}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
