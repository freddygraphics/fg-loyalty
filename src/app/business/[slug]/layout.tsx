import prisma from "@/lib/db";
import { getBusinessSession } from "@/lib/getBusinessSession";
import { notFound, redirect } from "next/navigation";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const isDev = process.env.NODE_ENV === "development";

  let business;

  // Obtener sesión
  const session = await getBusinessSession();

  // -----------------------------
  // DEVELOPMENT MODE
  // -----------------------------
  if (isDev) {
    business = await prisma.business.findUnique({
      where: { slug },
    });
  } else {
    // -----------------------------
    // PRODUCTION MODE
    // -----------------------------
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
    return (
      <div style={{ padding: 40 }}>Business not found for slug: {slug}</div>
    );
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
