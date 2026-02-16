import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function getBusinessSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      businesses: true,
    },
  });

  if (!user || user.businesses.length === 0) {
    throw new Error("Unauthorized");
  }

  const business = user.businesses[0];

  // 🔥 Trial protection
  if (
    business.status === "TRIALING" &&
    business.trialEndsAt &&
    new Date() > business.trialEndsAt
  ) {
    return {
      userId: user.id,
      businessId: business.id,
      trialExpired: true,
    };
  }

  return {
    userId: user.id,
    businessId: business.id,
    trialExpired: false,
  };
}
