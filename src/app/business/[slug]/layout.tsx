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
      name: true,
      status: true,
      trialEndsAt: true,
    },
  });

  if (!business) {
    notFound();
  }

  // Impide acceder al negocio de otro usuario
  if (business.id !== session.businessId) {
    redirect("/login");
  }

  // El tiempo actual es necesario para validar el vencimiento del trial
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
    redirect(`/business/${slug}/billing`);
  }

  return <>{children}</>;
}
