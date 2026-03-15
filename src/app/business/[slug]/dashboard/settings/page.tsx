"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SettingsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [form, setForm] = useState({
    goal: 10,
    earnStep: 1,
    limitMode: "cap",
    redeemMode: "reset",
  });

  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/business/${slug}/settings`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          goal: data.goal ?? 10,
          earnStep: data.earnStep ?? 1,
          limitMode: data.limitMode ?? "cap",
          redeemMode: data.redeemMode ?? "reset",
        }),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  async function saveSettings() {
    await fetch(`/api/business/${slug}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Settings saved");
  }

  if (loading) return <div>Loading settings…</div>;

  return (
    <div className="max-w-xl space-y-10">
      {/* 🎯 LOYALTY */}
      <section>
        <h2 className="text-2xl font-bold mb-4">History</h2>

        <div className="bg-white  border-[#ededed]  border rounded-lg p-5 space-y-4">
          <label className="block">
            Goal
            <input
              type="number"
              className="input w-full"
              value={form.goal}
              onChange={(e) =>
                setForm({ ...form, goal: Number(e.target.value) })
              }
            />
          </label>

          <label className="block">
            Earn step
            <input
              type="number"
              className="input w-full"
              value={form.earnStep}
              onChange={(e) =>
                setForm({ ...form, earnStep: Number(e.target.value) })
              }
            />
          </label>

          <label className="block">
            Limit mode
            <select
              className="input w-full"
              value={form.limitMode}
              onChange={(e) => setForm({ ...form, limitMode: e.target.value })}
            >
              <option value="cap">Cap</option>
              <option value="block">Block</option>
            </select>
          </label>

          <label className="block">
            Redeem mode
            <select
              className="input w-full"
              value={form.redeemMode}
              onChange={(e) => setForm({ ...form, redeemMode: e.target.value })}
            >
              <option value="reset">Reset</option>
              <option value="carry">Carry</option>
            </select>
          </label>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save changes
          </button>
        </div>
      </section>

      {/* ⚠️ MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">⚠ Confirm goal change</h2>

            <p className="text-sm text-gray-600">
              Changing the goal will affect all active customers. Their current
              progress will continue under the new goal.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  saveSettings();
                }}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Confirm change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
