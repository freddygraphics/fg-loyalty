import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function getBusinessSession() {
  const cookieStore = await cookies(); // 👈 obligatorio
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { businesses: true },
  });

  if (!user || user.businesses.length === 0) {
    throw new Error("Unauthorized");
  }

  return {
    userId: user.id,
    businessId: user.businesses[0].id,
  };
}
