"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type CustomerRow = {
  id: number;
  name: string;
  phone: string;
  points: number;
  lastScan: string | null;
};

export default function CustomersPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();

  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/business/${slug}/customers`)
      .then((res) => res.json())
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div>Loading customers…</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-right">Points</th>
              <th className="p-3 text-left">Last Scan</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() =>
                  router.push(`/business/${slug}/dashboard/customers/${c.id}`)
                }
                className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.phone}</td>
                <td className="p-3 text-right font-semibold">{c.points} pts</td>
                <td className="p-3 text-gray-500">
                  {c.lastScan ? new Date(c.lastScan).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS (YA OK) */}
      <div className="md:hidden space-y-3">
        {customers.map((c) => (
          <div
            key={c.id}
            onClick={() =>
              router.push(`/business/${slug}/dashboard/customers/${c.id}`)
            }
            className="bg-white border rounded-lg p-4 flex justify-between cursor-pointer hover:bg-gray-50"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">{c.phone}</p>
              <p className="text-xs text-gray-400">
                Last scan:{" "}
                {c.lastScan ? new Date(c.lastScan).toLocaleDateString() : "—"}
              </p>
            </div>

            <div className="font-bold text-lg">{c.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
