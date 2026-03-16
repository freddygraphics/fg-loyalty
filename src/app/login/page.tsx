"use client";

import { useState, useRef } from "react";

type LoginResponse = {
  success?: boolean;
  redirect?: string;
  redirectTo?: string;
  error?: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const email = String(form.get("email") || "")
      .toLowerCase()
      .trim();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      setLoading(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data: LoginResponse = {};

      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        setError(data.error || "Credenciales inválidas");
        setLoading(false);
        return;
      }

      const redirect = data.redirect || data.redirectTo;

      if (redirect) {
        window.location.href = redirect;
        return;
      }

      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Error inesperado. Intenta nuevamente.");
      }

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center">Iniciar sesión</h1>

        <div className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Acceder"}
        </button>
      </form>
    </main>
  );
}
