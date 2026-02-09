"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BusinessQR from "@/components/BusinessQR";

/* ---------------- Types ---------------- */

type Activity = {
  id: number;
  customerName: string;
  points: number;
  createdAt: string;
};

type Metrics = {
  scansToday: number;
  pointsToday: number;
  customers: number;
  goal: number;
  recentActivity: Activity[];
};

/* ---------------- Page ---------------- */

export default function DashboardPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : null;

  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/business/${slug}/metrics`)
      .then((res) => res.json())
      .then((data) =>
        setMetrics({
          scansToday: data.scansToday ?? 0,
          pointsToday: data.pointsToday ?? 0,
          customers: data.customers ?? 0,
          goal: data.goal ?? 0,
          recentActivity: data.recentActivity ?? [],
        }),
      );
  }, [slug]);

  if (!metrics) return <div>Loading dashboard…</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Overview of your loyalty program
        </p>
      </div>
      {/* 🔥 LOYALTY QR */}
      {slug && <BusinessQR slug={slug} />}
      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Scans Today" value={metrics.scansToday} />
        <StatCard label="Points Today" value={metrics.pointsToday} />
        <StatCard label="Customers" value={metrics.customers} />
        <StatCard
          label="Reward Goal"
          value={`${metrics.pointsToday} / ${metrics.goal}`}
        />
      </div>

      {/* RECENT ACTIVITY */}
      <section className="bg-white border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Recent Activity</h2>
        </div>

        <div className="divide-y">
          {metrics.recentActivity.length === 0 && (
            <div className="px-6 py-6 text-sm text-gray-500">
              No recent activity
            </div>
          )}

          {metrics.recentActivity.map((tx) => (
            <ActivityRow
              key={tx.id}
              name={tx.customerName}
              points={tx.points}
              time={timeAgo(tx.createdAt)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);

  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} min ago`;

  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ago`;

  return new Date(date).toLocaleDateString();
}

/* ---------------- UI Components ---------------- */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ActivityRow({
  name,
  points,
  time,
}: {
  name: string;
  points: number;
  time: string;
}) {
  return (
    <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-50">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>

      <div className="font-semibold text-green-600">+{points} pt</div>
    </div>
  );
}
