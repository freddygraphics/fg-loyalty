"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function JoinPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardToken, setCardToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/join/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrarse");
        setLoading(false);
        return;
      }

      // 👉 GUARDAMOS EL TOKEN EN VEZ DE REDIRIGIR
      setCardToken(data.cardToken);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     ESTADO 2: MOSTRAR QR
  ========================= */

  if (cardToken) {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/c/${cardToken}`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white w-full max-w-sm rounded-xl shadow p-6 text-center">
          <h1 className="text-xl font-bold mb-2">🎉 ¡Registro completo!</h1>

          <p className="text-sm text-gray-600 mb-4">
            Guarda este código QR. Lo usarás cada vez que visites el negocio.
          </p>

          <div className="flex justify-center mb-4">
            <QRCode value={url} size={200} />
          </div>

          <p className="text-xs text-gray-500 break-all">{url}</p>

          <button
            onClick={() => window.print()}
            className="mt-4 w-full bg-black text-white py-2 rounded font-medium"
          >
            Descargar / Imprimir
          </button>
          <a
            href={`/c/${cardToken}`}
            className="mt-3 block w-full border border-black text-black py-2 rounded font-medium"
          >
            Abrir mi tarjeta
          </a>
        </div>
      </div>
    );
  }

  /* =========================
     ESTADO 1: FORMULARIO
  ========================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-xl shadow p-6"
      >
        <h1 className="text-xl font-bold mb-2 text-center">
          Únete al programa de puntos
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
          required
        />

        <input
          type="email"
          placeholder="Email (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Crear mi tarjeta"}
        </button>
      </form>
    </div>
  );
}
