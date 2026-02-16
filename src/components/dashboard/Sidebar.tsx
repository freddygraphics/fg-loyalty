// components/dashboard/Sidebar.tsx
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  QrCode,
  History,
  Settings,
} from "lucide-react";

export default function Sidebar({ slug }: { slug: string }) {
  const nav = [
    { label: "Dashboard", icon: LayoutDashboard, href: "" },
    { label: "Clientes", icon: Users, href: "/customers" },
    { label: "Escanear", icon: QrCode, href: "/scan" },
    { label: "Historial", icon: History, href: "/history" },
    { label: "Configuración", icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="hidden w-72 bg-[#0A2540] text-white lg:flex lg:flex-col">
      <div className="px-6 py-6 font-semibold">FG-Loyalty</div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={`/business/${slug}/dashboard${item.href}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
