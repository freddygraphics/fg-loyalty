import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import BusinessJoinQR from "@/components/BusinessJoinQR";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const userId = Number(session.value);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      business: {
        include: {
          customers: true,
          cards: true,
          tx: true,
        },
      },
    },
  });

  if (!user || !user.business) {
    redirect("/login");
  }

  const business = user.business;

  // Métricas
  const totalCustomers = business.customers.length;
  const activeCards = business.cards.filter((c) => c.active).length;
  const totalTx = business.tx.length;

  // Movimientos de hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTx = business.tx.filter(
    (t) => new Date(t.createdAt) >= today,
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <p className="text-gray-600">Panel del programa de fidelización</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Metric title="Clientes" value={totalCustomers} />
        <Metric title="Tarjetas activas" value={activeCards} />
        <Metric title="Movimientos" value={totalTx} />
        <Metric title="Hoy" value={todayTx} />
      </div>
      {/* QR del negocio */}
      <div className="mb-8">
        <BusinessJoinQR slug={business.slug} />
      </div>

      {/* Reglas */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Reglas del programa</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>🎯 Meta: {business.goal} puntos</li>
          <li>➕ Suma: +{business.earnStep}</li>
          <li>🚫 Límite: {business.limitMode}</li>
          <li>🎁 Redimir: {business.redeemMode}</li>
        </ul>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink
          href="/dashboard/customers"
          title="Clientes"
          desc="Ver y gestionar clientes"
        />
        <QuickLink
          href="/dashboard/settings"
          title="Configuración"
          desc="Editar reglas del programa"
        />
        <QuickLink
          href="/dashboard/history"
          title="Historial"
          desc="Ver movimientos de puntos"
        />
      </div>
    </div>
  );
}

/* =====================
   UI Components
===================== */

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="bg-white p-4 rounded shadow hover:shadow-md transition"
    >
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </a>
  );
}
