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

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/business/${slug}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
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
        <h2 className="text-lg font-bold mb-4">🎯 Loyalty Configuration</h2>

        <div className="bg-white border rounded-lg p-5 space-y-4">
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
            onClick={saveSettings}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save changes
          </button>
        </div>
      </section>

      {/* 🔐 SECURITY */}
      <section>
        <h2 className="text-lg font-bold mb-4">🔐 Security</h2>

        <div className="bg-white border rounded-lg p-5 space-y-3">
          <p>PIN: ••••</p>
          <button className="border px-3 py-2 rounded">Change PIN</button>
        </div>
      </section>

      {/* ⚠️ DANGER */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-red-600">⚠️ Danger zone</h2>

        <div className="bg-white border border-red-200 rounded-lg p-5 space-y-3">
          <button className="w-full border border-red-500 text-red-600 px-4 py-2 rounded">
            Pause program
          </button>

          <button className="w-full bg-red-600 text-white px-4 py-2 rounded">
            Reset all points
          </button>
        </div>
      </section>
    </div>
  );
}
