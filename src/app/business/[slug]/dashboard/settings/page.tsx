import prisma from "@/lib/db";

export default async function SettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
  });

  if (!business) return null;

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Configuración</h1>

      <ul className="bg-white p-4 rounded shadow space-y-2">
        <li>🎯 Meta: {business.goal}</li>
        <li>➕ Por acción: {business.earnStep}</li>
        <li>🚫 Límite: {business.limitMode}</li>
        <li>🎁 Redimir: {business.redeemMode}</li>
      </ul>
    </>
  );
}
