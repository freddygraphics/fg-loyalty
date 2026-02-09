"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        businessName: form.get("businessName"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // 🚀 REDIRECT AL DASHBOARD
    router.push(`/business/${data.slug}/dashboard`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">
          Register your business
        </h1>

        <input
          name="name"
          className="input w-full"
          placeholder="Your name"
          required
        />

        <input
          name="email"
          type="email"
          className="input w-full"
          placeholder="Email"
          required
        />

        <input
          name="password"
          type="password"
          className="input w-full"
          placeholder="Password"
          required
        />

        <input
          name="businessName"
          className="input w-full"
          placeholder="Business name"
          required
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded"
        >
          {loading ? "Creating…" : "Create business"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have a business?{" "}
          <a href="/access" className="underline">
            Access here
          </a>
        </p>
      </form>
    </main>
  );
}
