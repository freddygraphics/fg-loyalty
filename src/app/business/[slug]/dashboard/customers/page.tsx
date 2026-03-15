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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!slug) return;

    async function loadCustomers() {
      try {
        const res = await fetch(`/api/business/${slug}/customers`);

        if (!res.ok) throw new Error("Failed to load customers");

        const data = await res.json();

        // Compatible con distintos formatos de API
        const list = Array.isArray(data)
          ? data
          : (data.customers ?? data.data ?? []);

        setCustomers(list);
      } catch (err) {
        console.error("Customers fetch error:", err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [slug]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );
  const totalPages = Math.ceil(filteredCustomers.length / perPage);

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * perPage,
    page * perPage,
  );
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-gray-500">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>

        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border  border-[#e5e7eb] rounded-lg px-3 py-2 text-sm w-64"
        />
      </div>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white border border-[#ededed] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FBFBFB] border-b border-[#ededed]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-right">Points</th>
              <th className="p-3 text-left">Last Scan</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500">
                  No customers yet
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() =>
                    router.push(`/business/${slug}/dashboard/customers/${c.id}`)
                  }
                  className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{c.name}</td>

                  <td className="p-3 text-gray-500">{c.phone || "—"}</td>

                  <td className="p-3 text-right font-semibold">
                    {c.points} pts
                  </td>

                  <td className="p-3 text-gray-500">
                    {c.lastScan
                      ? new Date(c.lastScan).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {customers.length === 0 ? (
          <div className="text-center text-gray-500 p-10">No customers yet</div>
        ) : (
          customers.map((c) => (
            <div
              key={c.id}
              onClick={() =>
                router.push(`/business/${slug}/dashboard/customers/${c.id}`)
              }
              className="bg-white border rounded-lg p-4 flex justify-between cursor-pointer hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold">{c.name}</p>

                <p className="text-sm text-gray-500">{c.phone || "—"}</p>

                <p className="text-xs text-gray-400">
                  Last scan:{" "}
                  {c.lastScan ? new Date(c.lastScan).toLocaleDateString() : "—"}
                </p>
              </div>

              <div className="font-bold text-lg">{c.points} pts</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
