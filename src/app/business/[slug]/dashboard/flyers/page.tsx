import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import FlyerBuilder from "@/components/flyers/FlyerBuilder";

export const dynamic = "force-dynamic";

export default async function FlyersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
    },
  });

  if (!business) {
    notFound();
  }

  return <FlyerBuilder businessName={business.name} slug={business.slug} />;
}
