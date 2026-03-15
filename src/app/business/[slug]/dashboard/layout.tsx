import DashboardShell from "@/components/dashboard/DashboardShell";
import prisma from "@/lib/db";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true },
  });

  return (
    <DashboardShell slug={slug} businessName={business?.name ?? ""}>
      {children}
    </DashboardShell>
  );
}
