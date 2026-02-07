import prisma from "@/lib/db";

export default async function HistoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const tx = await prisma.pointTransaction.findMany({
    where: {
      business: { slug: params.slug },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Historial</h1>

      <ul className="space-y-2">
        {tx.map((t) => (
          <li key={t.id} className="bg-white p-3 rounded shadow text-sm">
            <strong>{t.type}</strong> · {t.points} puntos
            <div className="text-gray-500 text-xs">
              {new Date(t.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
