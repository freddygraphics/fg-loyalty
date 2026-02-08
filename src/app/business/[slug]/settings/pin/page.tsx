"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function PinSetupPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  async function savePin() {
    const res = await fetch(`/api/business/${slug}/pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      setMsg("✅ PIN configurado correctamente");
    } else {
      setMsg("❌ Error al guardar PIN");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-lg font-bold text-center">
          Configurar PIN de caja
        </h1>

        <input
          type="password"
          maxLength={6}
          className="mt-4 w-full border px-3 py-2 rounded"
          placeholder="PIN (4 dígitos)"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={savePin}
          className="mt-4 w-full bg-black text-white py-2 rounded"
        >
          Guardar PIN
        </button>

        {msg && <p className="mt-3 text-center text-sm">{msg}</p>}
      </div>
    </main>
  );
}
