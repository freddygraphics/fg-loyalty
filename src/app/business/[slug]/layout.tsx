import prisma from "@/lib/db";
import { getBusinessSession } from "@/lib/getBusinessSession";
import { notFound, redirect } from "next/navigation";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  // SESSION
  const session = await getBusinessSession();

  if (!session) {
    redirect("/login");
  }

  // BUSINESS
  const business = await prisma.business.findFirst({
    where: {
      slug,
      id: session.businessId,
    },
  });

  if (!business) {
    notFound();
  }

  // TRIAL CHECK
  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    new Date() > business.trialEndsAt;

  // BLOCK ACCESS IF:
  // trial expired
  // canceled
  // payment failed
  if (
    trialExpired ||
    business.status === "CANCELED" ||
    business.status === "PAST_DUE"
  ) {
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
