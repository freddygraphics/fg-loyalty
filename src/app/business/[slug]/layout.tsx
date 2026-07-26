import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/session";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = verifySessionToken(token);

  if (!session) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
    },
  });

  if (!business) {
    notFound();
  }

  // Impide entrar al negocio de otro usuario
  if (business.id !== session.businessId) {
    redirect("/login");
  }

  return <>{children}</>;
}
