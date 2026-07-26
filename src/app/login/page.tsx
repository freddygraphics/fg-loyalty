"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

type LoginResponse = {
  success?: boolean;
  redirect?: string;
  redirectTo?: string;
  error?: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setError("El correo electrónico y la contraseña son requeridos.");
      setLoading(false);
      return;
    }

    abortRef.current?.abort();

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
      } catch {
        // La respuesta no contenía JSON
      }

      if (!res.ok) {
        setError(data.error || "Correo electrónico o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      const redirectTo = data.redirect || data.redirectTo || "/";

      window.location.assign(redirectTo);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Ocurrió un error inesperado. Intenta nuevamente.");
      }

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-950"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg font-bold text-white shadow-sm">
              F
            </span>
            Fideliza
          </Link>

          <p className="mt-3 text-sm text-gray-500">
            Administra tu programa de fidelización
          </p>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-9">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
              Bienvenido de nuevo
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Ingresa tus datos para acceder a tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-gray-950 transition hover:text-gray-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff size={19} aria-hidden="true" />
                  ) : (
                    <Eye size={19} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Iniciando sesión…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Todavía no tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-semibold text-gray-950 hover:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Fideliza. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
