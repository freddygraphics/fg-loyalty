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

  const session = await getBusinessSession();

  if (!session) {
    redirect("/login");
  }

  const business = await prisma.business.findFirst({
    where: {
      slug,
      id: session.businessId,
    },
  });

  if (!business) {
    notFound();
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

  if (!trialValid && !subscriptionActive) {
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
