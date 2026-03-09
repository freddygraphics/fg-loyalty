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
  if (!session) return notFound();

  const business = await prisma.business.findFirst({
    where: {
      slug,
      id: session.businessId,
    },
  });

  if (!business) return notFound();

  // negocio desactivado
  if (!business.active) {
    redirect("/pricing");
  }

  // trial expirado
  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    new Date() > business.trialEndsAt;

  if (trialExpired) {
    redirect("/pricing");
  }

  // suscripción inválida
  if (!["ACTIVE", "TRIALING"].includes(business.status)) {
    redirect("/pricing");
  }

  return <>{children}</>;
}
