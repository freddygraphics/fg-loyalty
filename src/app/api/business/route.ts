import prisma from "@/lib/db";

export async function POST(req: Request) {
  const { name, slug, goal } = await req.json();

  if (!name || !slug) {
    return Response.json(
      { error: "Nombre y slug son obligatorios" },
      { status: 400 },
    );
  }

  try {
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        goal: Number(goal) || 10,
      },
    });

    return Response.json(business);
  } catch {
    // slug duplicado u otro error
    return Response.json({ error: "El slug ya existe" }, { status: 400 });
  }
}
