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

  if (!session) redirect("/login");

  const business = await prisma.business.findFirst({
    where: {
      slug,
      id: session.businessId,
    },
  });

  if (!business) return notFound();

  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    new Date() > business.trialEndsAt;

  if (trialExpired || business.status === "CANCELED") {
    redirect("/pricing");
  }

  if (!["ACTIVE", "TRIALING"].includes(business.status)) {
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
