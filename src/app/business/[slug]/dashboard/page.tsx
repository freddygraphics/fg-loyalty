import prisma from "@/lib/db";

export default async function BusinessDashboard({
  params,
}: {
  params: { slug: string };
}) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      _count: {
        select: {
          customers: true,
          cards: true,
        },
      },
    },
  });

  if (!business) return null;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Clientes" value={business._count.customers} />
        <Card title="Tarjetas" value={business._count.cards} />
        <Card title="Meta de puntos" value={business.goal} />
      </div>
    </>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
