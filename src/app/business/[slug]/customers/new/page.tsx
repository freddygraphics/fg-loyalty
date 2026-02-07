"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function NewCustomerPage() {
  const { slug } = useParams<{ slug: string }>();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessSlug: slug,
        name,
        contact,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error");
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
  }

  if (result) {
    const fullUrl = `${window.location.origin}${result.scanUrl}`;

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
