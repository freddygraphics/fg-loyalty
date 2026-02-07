"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateClientAndCardPage() {
  const params = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug;

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/business/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Negocio no encontrado");
        return r.json();
      })
      .catch(() => setError("Negocio no encontrado"));
  }, [slug]);

  // 👇 el return condicional va DESPUÉS de los hooks
  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold text-center">
          Crear cliente y tarjeta
        </h1>

        <p className="text-center text-sm text-gray-500 mt-1">
          Negocio: <b>{slug}</b>
        </p>

        {error && <p className="mt-3 text-center text-red-600">{error}</p>}

        {/* FORMULARIO VA AQUÍ */}
      </div>
    </main>
  );
}
