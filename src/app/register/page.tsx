"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        // ✅ ruta correcta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          businessName: form.get("businessName"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Error creating account");
        setLoading(false);
        return;
      }

      router.replace(data.redirectTo); // ✅ coherente con API
    } catch (err) {
      setError("Unexpected error. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">
          Crea tu programa de puntos
        </h1>

        <div className="space-y-4">
          <input
            name="businessName"
            placeholder="Nombre del negocio"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear mi programa gratis"}
        </button>

        <p className="text-sm text-center text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="underline hover:text-black">
            Iniciar sesión
          </a>
        </p>
      </form>
    </main>
  );
}
