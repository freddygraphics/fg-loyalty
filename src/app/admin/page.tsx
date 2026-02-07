import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const admin = cookieStore.get("admin");

  // 🔒 Protección básica
  if (!admin) {
    redirect("/admin/login");
  }

  const businesses = await prisma.business.findMany({
    include: {
      owner: true,
      customers: true,
      cards: true,
      tx: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin — Negocios</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Negocio</Th>
              <Th>Dueño</Th>
              <Th>Clientes</Th>
              <Th>Tarjetas</Th>
              <Th>Movimientos</Th>
              <Th>Creado</Th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id} className="border-t">
                <Td>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-gray-500 text-xs">/{b.slug}</div>
                </Td>
                <Td>
                  {b.owner.name}
                  <div className="text-xs text-gray-500">{b.owner.email}</div>
                </Td>
                <Td>{b.customers.length}</Td>
                <Td>{b.cards.length}</Td>
                <Td>{b.tx.length}</Td>
                <Td>{new Date(b.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =====================
   UI helpers
===================== */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-medium text-gray-600">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}
