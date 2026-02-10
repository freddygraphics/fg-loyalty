"use client";

import { useState } from "react";

export default function PinSecurity({
  slug,
  onChangePin,
}: {
  slug: string;
  onChangePin: () => void;
}) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function revealPin() {
    if (!confirm("Reveal PIN for 10 seconds?")) return;

    setLoading(true);

    const res = await fetch(`/api/business/${slug}/reveal-pin`);
    const data = await res.json();

    if (res.ok) {
      setPin(data.pin);
      setShowPin(true);

      setTimeout(() => {
        setShowPin(false);
        setPin(null);
      }, 10000);
    } else {
      alert("Not allowed");
    }

    setLoading(false);
  }

  return (
    <div className="bg-white border rounded-lg p-5 space-y-3">
      <div className="flex items-center gap-4">
        <p>
          PIN: <strong>{showPin ? pin : "••••"}</strong>
        </p>

        <button
          onClick={revealPin}
          disabled={loading}
          className="border px-3 py-2 rounded"
        >
          Reveal PIN
        </button>

        <button onClick={onChangePin} className="border px-3 py-2 rounded">
          Change PIN
        </button>
      </div>

      {showPin && (
        <p className="text-xs text-gray-500">PIN visible for 10 seconds</p>
      )}
    </div>
  );
}
