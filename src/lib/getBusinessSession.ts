import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function getBusinessSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      businesses: true,
    },
  });

  if (!user || user.businesses.length === 0) {
    return null;
  }

  const business = user.businesses[0];

  const trialExpired =
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    new Date() > business.trialEndsAt;

  return {
    userId: user.id,
    businessId: business.id,
    trialExpired,
  };
}
