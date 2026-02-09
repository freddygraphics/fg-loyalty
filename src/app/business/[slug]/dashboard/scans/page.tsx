"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ScanTx = {
  id: number;
  points: number;
  createdAt: string;
  card: {
    customer: {
      name: string;
      phone: string;
    };
  };
};

export default function ScansPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [scans, setScans] = useState<ScanTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/business/${slug}/transactions`)
      .then((res) => res.json())
      .then(setScans)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div>Loading scans…</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Scan History</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{s.card.customer.name}</td>
                <td className="p-3 text-gray-500">{s.card.customer.phone}</td>
                <td className="p-3 text-gray-500">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-right font-semibold text-green-600">
                  +{s.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {scans.map((s) => (
          <div
            key={s.id}
            className="bg-white border rounded-lg p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">{s.card.customer.name}</p>
              <p className="text-sm text-gray-500">{s.card.customer.phone}</p>
              <p className="text-xs text-gray-400">
                {new Date(s.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="font-bold text-green-600">+{s.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
