"use client";

import Link from "next/link";
import { Suspense, SyntheticEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";

type ResetPasswordResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token")?.trim() || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccessMessage("");

    if (!token) {
      setError(
        "El enlace de recuperación no contiene un token válido. Solicita uno nuevo.",
      );
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      let data: ResetPasswordResponse = {};

      try {
        data = await response.json();
      } catch {
        // La respuesta no contenía JSON
      }

      if (!response.ok) {
        setError(
          data.error ||
            "No fue posible actualizar la contraseña. Intenta nuevamente.",
        );
        return;
      }

      setPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        data.message || "Tu contraseña fue actualizada correctamente.",
      );
    } catch {
      setError("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  if (successMessage) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={28} aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-gray-950">
          Contraseña actualizada
        </h1>

        <p role="status" className="mt-3 text-sm leading-6 text-gray-500">
          {successMessage}
        </p>

        <Link
          href="/login"
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-950/15"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          Crea una contraseña nueva
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          La contraseña debe contener al menos 8 caracteres.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          id="password"
          label="Contraseña nueva"
          value={password}
          showPassword={showPassword}
          disabled={loading}
          autoComplete="new-password"
          onChange={setPassword}
          onToggle={() => setShowPassword((current) => !current)}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirmar contraseña"
          value={confirmPassword}
          showPassword={showConfirmation}
          disabled={loading}
          autoComplete="new-password"
          onChange={setConfirmPassword}
          onToggle={() => setShowConfirmation((current) => !current)}
        />

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
          disabled={loading || !token}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-950/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Actualizando contraseña…
            </>
          ) : (
            "Actualizar contraseña"
          )}
        </button>
      </form>

      <div className="mt-7 border-t border-gray-100 pt-6 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-gray-700 transition hover:text-gray-950 hover:underline"
        >
          Solicitar otro enlace
        </Link>
      </div>
    </>
  );
}

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  disabled: boolean;
  autoComplete: string;
  onChange: (value: string) => void;
  onToggle: () => void;
};

function PasswordInput({
  id,
  label,
  value,
  showPassword,
  disabled,
  autoComplete,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Mínimo 8 caracteres"
          autoComplete={autoComplete}
          disabled={disabled}
          minLength={8}
          required
          className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
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
  );
}

export default function ResetPasswordPage() {
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
          <Suspense
            fallback={
              <p className="py-10 text-center text-sm text-gray-500">
                Cargando…
              </p>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Fideliza. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
