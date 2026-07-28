import Link from "next/link";
import prisma from "@/lib/db";
import MetricCard from "@/components/dashboard/MetricCard";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Gift,
  History,
  ScanLine,
  Target,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dashboard = await getTranslations("Dashboard");
  const common = await getTranslations("Common");
  const locale = await getLocale();
  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      goal: true,
    },
  });

  if (!business) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {dashboard("businessNotFound")}: {slug}
      </div>
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [customersCount, scansToday, pointsAgg, recentTransactions] =
    await Promise.all([
      prisma.customer.count({
        where: {
          businessId: business.id,
        },
      }),

      prisma.pointTransaction.count({
        where: {
          businessId: business.id,
          createdAt: {
            gte: startOfDay,
          },
        },
      }),

      prisma.pointTransaction.aggregate({
        _sum: {
          points: true,
        },
        where: {
          businessId: business.id,
          createdAt: {
            gte: startOfDay,
          },
        },
      }),

      prisma.pointTransaction.findMany({
        where: {
          businessId: business.id,
        },
        select: {
          id: true,
          points: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      }),
    ]);

  const pointsToday = pointsAgg._sum.points ?? 0;

  return (
    <div>
      {/* SALUDO */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            {dashboard("hello")}, {business.name} 👋
          </h1>

          <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
            {dashboard("summary")}
          </p>
        </div>

        <LanguageSwitcher />
      </section>

      <div className="grid grid-cols-1 gap-6">
        <div className="min-w-0 space-y-6">
          {/* MÉTRICAS */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <MetricCard
              title={dashboard("scansToday")}
              value={scansToday}
              icon={<ScanLine size={18} />}
            />

            <MetricCard
              title={dashboard("pointsToday")}
              value={pointsToday}
              icon={<Gift size={18} />}
            />

            <Link
              href={`/business/${slug}/dashboard/customers`}
              className="block rounded-xl outline-none transition hover:-translate-y-0.5 focus:ring-4 focus:ring-gray-950/10"
            >
              <MetricCard
                title={dashboard("customers")}
                value={customersCount}
                icon={<Users size={18} />}
              />
            </Link>

            <MetricCard
              title={dashboard("goal")}
              value={business.goal}
              icon={<Target size={18} />}
            />
          </section>

          {/* HISTORIAL */}
          <section className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white">
            <div className="flex items-center justify-between border-b border-[#ededed] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                  <History size={18} />
                </span>

                <div>
                  <h2 className="font-semibold text-gray-950">
                    {dashboard("recentHistory")}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {dashboard("latestActivity")}
                  </p>
                </div>
              </div>

              <Link
                href={`/business/${slug}/history`}
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-gray-950"
              >
                <span className="hidden sm:inline">{dashboard("viewAll")}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <History size={22} />
                </span>

                <p className="mt-4 text-sm font-semibold text-gray-800">
                  {dashboard("noActivity")}
                </p>

                <p className="mt-1 max-w-xs text-sm text-gray-500">
                  {dashboard("noActivityDescription")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <Gift size={18} />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {dashboard("pointsRegistered")}
                        </p>

                        <p className="text-xs text-gray-500">
                          {new Intl.DateTimeFormat(
                            locale === "es" ? "es-US" : "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          ).format(transaction.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        transaction.points >= 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {transaction.points >= 0 ? "+" : ""}
                      {transaction.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
