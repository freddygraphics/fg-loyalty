"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

type ForgotPasswordResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      let data: ForgotPasswordResponse = {};

      try {
        data = await response.json();
      } catch {
        // La respuesta no contenía JSON
      }

      if (!response.ok) {
        setError(
          data.error || "No fue posible enviar el correo. Intenta nuevamente.",
        );
        return;
      }

      setSuccessMessage(
        data.message ||
          "Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.",
      );
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-4 py-10">
      <div className="w-full max-w-md">
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
            Recuperación segura de tu cuenta
          </p>
        </div>

        <div className="rounded-2xl border border-[#e8e8e8] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-9">
          {successMessage ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 size={28} aria-hidden="true" />
              </div>

              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
                Revisa tu correo
              </h1>

              <p role="status" className="mt-3 text-sm leading-6 text-gray-500">
                {successMessage}
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Revisa también las carpetas de correo no deseado o promociones.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-950/15"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
                  ¿Olvidaste tu contraseña?
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Ingresa el correo asociado con tu cuenta. Te enviaremos un
                  enlace para crear una contraseña nueva.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nombre@empresa.com"
                      autoComplete="email"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
                    />
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
                      Enviando enlace…
                    </>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-gray-950"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Volver a iniciar sesión
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Fideliza. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
