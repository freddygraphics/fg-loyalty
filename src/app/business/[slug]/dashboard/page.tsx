// app/business/[slug]/dashboard/page.tsx

import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import MetricCard from "@/components/dashboard/MetricCard";
import { Gift, Users, ScanLine, Target } from "lucide-react";
import BusinessQR from "@/components/dashboard/BusinessQR";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // 👈 IMPORTANTE

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
      goal: true,
    },
  });

  if (!business) return notFound();

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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resumen</h2>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Scans hoy"
          value={scansToday}
          icon={<ScanLine size={20} />}
        />
        <MetricCard
          title="Puntos hoy"
          value={pointsToday}
          icon={<Gift size={20} />}
        />
        <MetricCard
          title="Clientes"
          value={customersCount}
          icon={<Users size={20} />}
        />
        <MetricCard
          title="Meta"
          value={business.goal}
          icon={<Target size={20} />}
        />
        <BusinessQR slug={slug} />;
      </section>
    </div>
  );
}
