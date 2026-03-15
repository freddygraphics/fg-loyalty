import prisma from "@/lib/db";
import MetricCard from "@/components/dashboard/MetricCard";
import { Gift, Users, ScanLine, Target } from "lucide-react";
import BusinessQR from "@/components/dashboard/BusinessQR";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      goal: true,
    },
  });

  if (!business) {
    return <div className="p-10 text-red-500">Business not found: {slug}</div>;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const customersCount = await prisma.customer.count({
    where: { businessId: business.id },
  });

  const scansToday = await prisma.pointTransaction.count({
    where: {
      businessId: business.id,
      createdAt: { gte: startOfDay },
    },
  });

  const pointsAgg = await prisma.pointTransaction.aggregate({
    _sum: { points: true },
    where: {
      businessId: business.id,
      createdAt: { gte: startOfDay },
    },
  });

  const pointsToday = pointsAgg._sum.points ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              title="Scans hoy"
              value={scansToday}
              icon={<ScanLine size={18} />}
            />

            <MetricCard
              title="Puntos hoy"
              value={pointsToday}
              icon={<Gift size={18} />}
            />

            <MetricCard
              title="Clientes"
              value={customersCount}
              icon={<Users size={18} />}
            />

            <MetricCard
              title="Meta"
              value={business.goal}
              icon={<Target size={18} />}
            />
          </div>
        </div>

        <div className="border border-[#ededed] rounded-lg h-[500px]" />
      </div>

      <div className="border border-[#ededed] rounded-lg overflow-hidden">
        <div className="p-5 bg-[#FBFBFB] border-b border-[#ededed]">
          <h2 className="text-xs text-[#666666]">Business Name</h2>

          <h2 className="text-xl font-semibold leading-tight">
            {business.name}
          </h2>
        </div>

        <div className="p-6 flex justify-center">
          <BusinessQR slug={slug} />
        </div>
      </div>
    </div>
  );
}
