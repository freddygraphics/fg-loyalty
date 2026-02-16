// app/business/[slug]/dashboard/layout.tsx

import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // 👈 IMPORTANTE

  return <DashboardShell slug={slug}>{children}</DashboardShell>;
}
