import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const tx = await prisma.pointTransaction.findMany({
    where: {
      business: { slug: params.slug },
      type: "earn", // 👈 SOLO scans
    },
    include: {
      card: {
        include: {
          customer: true,
        },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json(tx);
}
