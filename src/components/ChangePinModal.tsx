"use client";

import { useState } from "react";

export default function ChangePinModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit() {
    setError(null);

    if (!/^\d{4,6}$/.test(pin)) {
      setError("PIN must be 4–6 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/business/${slug}/change-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Failed to change PIN");
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-bold">Change PIN</h3>

        {success ? (
          <p className="text-green-600 font-medium">
            ✅ PIN updated successfully
          </p>
        ) : (
          <>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="New PIN"
              className="input w-full"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="Confirm PIN"
              className="input w-full"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-3 py-2 border rounded"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={submit}
                disabled={loading}
                className="px-3 py-2 bg-black text-white rounded"
              >
                {loading ? "Saving…" : "Save PIN"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
