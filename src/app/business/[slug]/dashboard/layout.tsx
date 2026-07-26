import DashboardShell from "@/components/dashboard/DashboardShell";
import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";

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
      name: true,
      status: true,
      trialEndsAt: true,
    },
  });

  if (!business) {
    notFound();
  }

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt !== null &&
    business.trialEndsAt.getTime() <= now;

  if (trialExpired) {
    redirect(`/business/${slug}/billing?reason=trial_expired`);
  }

  if (business.status !== "ACTIVE" && business.status !== "TRIALING") {
    redirect(`/business/${slug}/billing?reason=subscription_required`);
  }

  return (
    <DashboardShell slug={slug} businessName={business.name}>
      {children}
    </DashboardShell>
  );
}
