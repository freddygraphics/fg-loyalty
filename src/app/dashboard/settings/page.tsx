import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const userId = Number(session.value);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { business: true },
  });

  if (!user || !user.business) {
    redirect("/login");
  }

  const business = user.business;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow p-6">
        <h1 className="text-xl font-bold mb-4">Configuración del programa</h1>

        <form
          action="/api/business/settings"
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="businessId" value={business.id} />

          {/* Meta */}
          <div>
            <label className="block text-sm font-medium">Meta de puntos</label>
            <input
              name="goal"
              type="number"
              defaultValue={business.goal}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Earn step */}
          <div>
            <label className="block text-sm font-medium">
              Puntos por acción
            </label>
            <input
              name="earnStep"
              type="number"
              defaultValue={business.earnStep}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Límite */}
          <div>
            <label className="block text-sm font-medium">
              Límite de puntos
            </label>
            <select
              name="limitMode"
              defaultValue={business.limitMode}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="cap">No pasar la meta</option>
              <option value="overflow">Permitir pasar</option>
            </select>
          </div>

          {/* Redimir */}
          <div>
            <label className="block text-sm font-medium">Al redimir</label>
            <select
              name="redeemMode"
              defaultValue={business.redeemMode}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="reset">Volver a 0</option>
              <option value="subtract">Restar meta</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded font-medium"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
