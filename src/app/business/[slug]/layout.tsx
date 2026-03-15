import prisma from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import type { Business } from "@prisma/client";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const isDev = process.env.NODE_ENV === "development";

  let business: Business | null = null;

  const session = await getSession();

  if (isDev) {
    business = await prisma.business.findUnique({
      where: { slug },
    });
  } else {
    if (!session) {
      redirect("/login");
    }

    business = await prisma.business.findFirst({
      where: {
        slug,
        id: session.businessId,
      },
    });
  }

  if (!business) {
    redirect("/login");
  }

  if (!isDev && session && session.businessId !== business.id) {
    redirect("/login");
  }

  const now = new Date();

  const trialValid =
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    business.trialEndsAt > now;

  const subscriptionActive =
    business.status === "ACTIVE" &&
    business.currentPeriodEnd &&
    business.currentPeriodEnd > now;

  if (!isDev && !trialValid && !subscriptionActive) {
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
