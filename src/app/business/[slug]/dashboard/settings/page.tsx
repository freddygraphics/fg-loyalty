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
    <div className="max-w-2xl space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>

        <div className="bg-white border border-[#ededed] rounded-lg p-6">
          {/* GOAL */}
          <div className="flex items-start justify-between py-5">
            <div>
              <p className="font-medium">Goal</p>
              <p className="text-sm text-gray-500">
                Number of points required to redeem the reward.
              </p>
            </div>

            <input
              type="number"
              value={form.goal}
              onChange={(e) =>
                setForm({ ...form, goal: Number(e.target.value) })
              }
              className="w-24 border border-[#ededed]  rounded-md px-3 py-2 text-right"
            />
          </div>

          {/* EARN STEP */}
          <div className="flex items-start justify-between py-5">
            <div>
              <p className="font-medium">Earn step</p>
              <p className="text-sm text-gray-500">
                Points given each time a customer is scanned.
              </p>
            </div>

            <input
              type="number"
              value={form.earnStep}
              onChange={(e) =>
                setForm({ ...form, earnStep: Number(e.target.value) })
              }
              className="w-24 border border-[#ededed]  rounded-md px-3 py-2 text-right"
            />
          </div>

          {/* LIMIT MODE */}
          <div className="flex items-start justify-between py-5">
            <div>
              <p className="font-medium">Limit mode</p>
              <p className="text-sm text-gray-500">
                Controls whether points stop when the goal is reached.
              </p>
            </div>

            <select
              value={form.limitMode}
              onChange={(e) => setForm({ ...form, limitMode: e.target.value })}
              className="border border-[#ededed]  rounded-md px-3 py-2 w-32"
            >
              <option value="cap">Cap</option>
              <option value="block">Block</option>
            </select>
          </div>

          {/* REDEEM MODE */}
          <div className="flex items-start justify-between py-5">
            <div>
              <p className="font-medium">Redeem mode</p>
              <p className="text-sm text-gray-500">
                What happens after a reward is redeemed.
              </p>
            </div>

            <select
              value={form.redeemMode}
              onChange={(e) => setForm({ ...form, redeemMode: e.target.value })}
              className="border border-[#ededed]  rounded-md px-3 py-2 w-32"
            >
              <option value="reset">Reset</option>
              <option value="carry">Carry</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="mt-5 bg-black text-white px-4 py-2 rounded"
        >
          Save changes
        </button>
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
