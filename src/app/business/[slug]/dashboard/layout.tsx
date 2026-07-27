import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      status: true,
      trialEndsAt: true,
    },
  });

  if (!business) {
    notFound();
  }

  // Necesario para verificar el vencimiento del período de prueba
  // eslint-disable-next-line react-hooks/purity
  const currentTime = Date.now();

  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt !== null &&
    business.trialEndsAt.getTime() <= currentTime;

  if (trialExpired) {
    redirect(`/business/${slug}/billing?reason=trial_expired`);
  }

  if (business.status !== "ACTIVE" && business.status !== "TRIALING") {
    redirect(`/business/${slug}/billing?reason=subscription_required`);
  }

  return <>{children}</>;
}
