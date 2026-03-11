// components/dashboard/Sidebar.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  QrCode,
  History,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  const nav = [
    { label: "Dashboard", icon: LayoutDashboard, href: "" },
    { label: "Clientes", icon: Users, href: "/customers" },
    { label: "Escanear", icon: QrCode, href: "/scan" },
    { label: "Historial", icon: History, href: "/history" },
    { label: "Configuración", icon: Settings, href: "/settings" },
  ];

  return (
    <>
      {/* MOBILE BUTTON */}
      <button onClick={() => setOpen(true)} className="lg:hidden p-3">
        <Menu size={22} />
      </button>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[#ededed] bg-[#FBFBFB] flex flex-col">
        {/* CLOSE BUTTON MOBILE */}
        <div className="flex justify-end p-4 lg:hidden">
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={`/business/${slug}/dashboard${item.href}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
