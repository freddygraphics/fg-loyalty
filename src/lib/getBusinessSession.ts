import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { verifySessionToken } from "@/lib/session";

export async function getBusinessSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const session = verifySessionToken(token);

  if (!session) return null;

  const business = await prisma.business.findFirst({
    where: {
      id: session.businessId,
      owner: {
        id: session.userId,
      },
    },
    select: {
      id: true,
      slug: true,
      status: true,
      trialEndsAt: true,
    },
  });

  if (!business) return null;

  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt !== null &&
    business.trialEndsAt.getTime() <= Date.now();

  return {
    userId: session.userId,
    businessId: business.id,
    slug: business.slug,
    status: business.status,
    trialExpired,
  };
}
