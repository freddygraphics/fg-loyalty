"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanAccessPage() {
  const [slug, setSlug] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();

  async function handleAccess() {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, pin }),
    });

    if (res.ok) {
      router.push(`/scan/${slug}`);
    } else {
      alert("Invalid PIN");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Scan access</h1>

        <input
          placeholder="Business slug"
          className="input"
          onChange={(e) => setSlug(e.target.value)}
        />

        <input
          placeholder="PIN"
          type="password"
          className="input mt-2"
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={handleAccess}
          className="mt-4 w-full bg-black text-white py-2 rounded"
        >
          Access
        </button>
      </div>
    </main>
  );
}
