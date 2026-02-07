import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-black text-white p-5">
        <h1 className="text-xl font-bold mb-6">Loyalty Admin</h1>

        <nav className="space-y-3">
          <Link href="/admin">🏠 Inicio</Link>
          <Link href="/admin/business/new">➕ Crear negocio</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
