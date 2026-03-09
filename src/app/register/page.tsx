"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        // ✅ ruta correcta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          businessName: form.get("businessName"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Error creating account");
        setLoading(false);
        return;
      }

      window.location.href = data.stripeUrl;
      // ✅ coherente con API
    } catch (err) {
      setError("Unexpected error. Try again.");
      setLoading(false);
    }
  }
  const useCases = [
    "Restaurantes y cafeterías",
    "Barberías y salones de belleza",
    "Car wash / detailing",
    "Gimnasios",
    "Landscaping y servicios locales",
    "Tiendas y comercios",
  ];
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* SECCIÓN SUPERIOR */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-bold mb-6">
              Turn first-time buyers into loyal customers
            </h1>

            <p className="text-gray-600 mb-6 text-lg">
              Launch your digital loyalty program with QR cards in minutes.
              Increase repeat visits, boost revenue, and track everything in
              real time.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>✓ Digital QR loyalty cards</li>
              <li>✓ Instant scanning from any phone</li>
              <li>✓ Full control over points & rewards</li>
              <li>✓ Real-time customer tracking</li>
            </ul>
          </div>

          {/* RIGHT */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Program example
                </div>
                <div className="text-xs text-slate-500">
                  “Buy 9, get the 10th free”
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Popular
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Goal</div>
                <div className="text-lg font-bold">10 points</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Earn</div>
                <div className="text-lg font-bold">+1 per visit</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Reward</div>
                <div className="text-lg font-bold">Free</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Control</div>
                <div className="text-lg font-bold">Dashboard</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold">Who can use it?</div>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                {useCases.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FORMULARIO ABAJO */}
        <div className="max-w-xl mx-auto mt-10">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl">
            <h2 className="text-3xl font-semibold text-center">
              Start your 7-day free trial
            </h2>

            <div className="space-y-6 mt-10">
              {/* Business Name */}
              <div className="space-y-2">
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business name <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  placeholder="e.g. Demo Coffee Shop"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="text" // 👈 ahora se ve mientras escribes
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-black text-white w-full py-3 rounded-xl font-medium hover:bg-gray-900 transition disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Start my 7-Day Trial"}
            </button>

            <p className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="underline hover:text-black">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
