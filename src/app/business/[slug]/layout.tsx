import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
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
  const token = cookieStore.get("owner_session")?.value;

  // ❌ No hay sesión
  if (!token) {
    redirect("/login");
  }

  // ❌ Token inválido
  const session = verifySessionToken(token);
  if (!session) {
    redirect("/login");
  }

  // 🔍 Buscar negocio
  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      status: true,
    },
  });

  // ❌ No existe
  if (!business) {
    notFound();
  }

  // ❌ Multi-tenant protection
  if (business.id !== session.businessId) {
    redirect("/login");
  }

  // 💳 Control SaaS (Stripe)
  if (business.status !== "ACTIVE" && business.status !== "TRIALING") {
    redirect(`/business/${slug}/billing`);
  }

  return <>{children}</>;
}
