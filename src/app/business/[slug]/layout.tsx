import prisma from "@/lib/db";
import { getBusinessSession } from "@/lib/getBusinessSession";
import { notFound, redirect } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import Link from "next/link";

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

  if (!business.active) redirect("/pricing");

  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    new Date() > business.trialEndsAt;

  if (trialExpired) redirect("/pricing");

  if (!["ACTIVE", "TRIALING"].includes(business.status)) {
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* NAVIGATION */}

      {/* PAGE CONTENT */}
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
