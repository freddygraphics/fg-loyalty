"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Tx = {
  id: number;
  type: string;
  points: number;
  createdAt: string;
  note: string | null;
};

type CustomerDetail = {
  id: number;
  name: string;
  phone: string;
  points: number;
  history: Tx[];
};

export default function CustomerDetailPage() {
  const params = useParams();

  // ✅ EXTRAER DE FORMA SEGURA
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : null;

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : null;

  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !id) return;

    fetch(`/api/business/${slug}/customers/${id}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [slug, id]);

  if (loading) return <div>Loading customer…</div>;
  if (!data) return <div>Customer not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-lg p-5">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-gray-500">{data.phone}</p>
        <p className="mt-2 text-lg font-semibold">Points: {data.points}</p>
      </div>

      {/* HISTORY */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="border-b px-5 py-3 font-semibold">Scan History</div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-right">Points</th>
              <th className="p-3 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            {data.history.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="p-3">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
                <td className="p-3 capitalize">{t.type}</td>
                <td className="p-3 text-right font-semibold">
                  {t.type === "earn" ? "+" : "-"}
                  {t.points}
                </td>
                <td className="p-3 text-gray-500">{t.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
