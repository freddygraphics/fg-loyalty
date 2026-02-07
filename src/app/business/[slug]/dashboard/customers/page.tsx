import prisma from "@/lib/db";

export default async function CustomersPage({
  params,
}: {
  params: { slug: string };
}) {
  const customers = await prisma.customer.findMany({
    where: {
      business: { slug: params.slug },
    },
    include: {
      cards: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Clientes</h1>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nombre</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.phone}</td>
              <td className="p-2">{c.cards[0]?.points ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
