"use client";

import { use, useState } from "react";
import QRCode from "react-qr-code";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function JoinPage({ params }: PageProps) {
  const { slug } = use(params);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardToken, setCardToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/join/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Error registering");
      return;
    }

    setCardToken(data.cardToken);
    setSuccess(true);
  }

  // ✅ CUANDO YA SE REGISTRÓ → MOSTRAR TARJETA
  if (success && cardToken) {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://fg-loyalty.vercel.app";

    const cardUrl = `${appUrl}/scan/${cardToken}`;

    function sendWhatsApp() {
      const text = encodeURIComponent(
        `🎉 Welcome to our loyalty program!\n\n` +
          `👤 Name: ${name}\n` +
          `🏪 Business: ${slug.replace("-", " ")}\n\n` +
          `🔗 Your loyalty card:\n${cardUrl}\n\n` +
          `⭐ Show this QR every time you visit`,
      );

      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    }

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl text-center space-y-4 shadow w-full max-w-sm">
          <h1 className="text-xl font-bold">🎉 Welcome!</h1>

          <p className="text-sm text-gray-600">This is your loyalty card</p>

          <QRCode value={cardUrl} size={200} />

          <p className="text-xs text-gray-500 break-all">{cardUrl}</p>

          <button
            onClick={sendWhatsApp}
            className="w-full bg-green-600 text-white py-2 rounded font-medium"
          >
            📲 Send to WhatsApp
          </button>

          <p className="text-xs text-gray-400">
            Save this QR or keep it on WhatsApp
          </p>
        </div>
      </main>
    );
  }

  // 📝 FORMULARIO
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          Join our loyalty program
        </h1>

        <input
          required
          className="input w-full"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          required
          className="input w-full"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Joining…" : "Join"}
        </button>
      </form>
    </main>
  );
}
