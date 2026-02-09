"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid credentials");
      setLoading(false);
      return;
    }

    router.push(`/business/${data.slug}/dashboard`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Access Dashboard</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input w-full"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input w-full"
          required
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Signing in…" : "Access"}
        </button>
      </form>
    </main>
  );
}
