"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

type CreateCustomerResult = {
  scanUrl: string;
  customer: {
    name: string;
  };
};

export default function NewCustomerPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<CreateCustomerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!slug) {
      setError("Negocio no válido");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug: slug,
          name,
          contact,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
      } & CreateCustomerResult;

      if (!res.ok) {
        setError(data.error || "Error");
        setLoading(false);
        return;
      }

      setResult({
        scanUrl: data.scanUrl,
        customer: { name: data.customer?.name ?? name },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const fullUrl = useMemo(() => {
    if (!result) return "";
    // ✅ evita usar window directamente si por alguna razón se evalúa antes
    if (typeof window === "undefined") return result.scanUrl;
    return `${window.location.origin}${result.scanUrl}`;
  }, [result]);

  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow text-center">
          <p>Cargando…</p>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow text-center">
          <h1 className="text-xl font-bold">Tarjeta creada 🎉</h1>

          <p className="mt-2 text-sm text-gray-600">
            Cliente: <strong>{result.customer.name}</strong>
          </p>

          <div className="mt-6 flex justify-center">
            <QRCode value={fullUrl} size={180} />
          </div>

          <p className="mt-3 text-xs break-all text-gray-500">{fullUrl}</p>

          <a
            href={result.scanUrl}
            className="mt-6 block rounded bg-black py-3 text-white"
          >
            Probar tarjeta
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-xl font-bold text-center">
          Crear cliente y tarjeta
        </h1>

        <p className="mt-1 text-center text-sm text-gray-600">
          Negocio: <strong>{slug}</strong>
        </p>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium">Nombre del cliente</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Contacto</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="WhatsApp / Email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-black py-3 text-white disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear tarjeta"}
        </button>
      </form>
    </main>
  );
}
