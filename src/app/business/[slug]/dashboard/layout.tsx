import Link from "next/link";
import { ReactNode } from "react";

export default async function BusinessDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-black text-white p-4">
        <h2 className="font-bold text-lg mb-6">{slug}</h2>

        <nav className="space-y-3">
          <Link href={`/business/${slug}/dashboard`}>🏠 Resumen</Link>
          <Link href={`/business/${slug}/dashboard/scan`}>📱 Escanear</Link>
          <Link href={`/business/${slug}/dashboard/customers`}>
            👥 Clientes
          </Link>
          <Link href={`/business/${slug}/dashboard/history`}>🔁 Historial</Link>
          <Link href={`/business/${slug}/dashboard/settings`}>
            ⚙️ Configuración
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
