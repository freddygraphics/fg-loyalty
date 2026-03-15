"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const base = `/business/${slug}/dashboard`;

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, href: base },
    { name: "Customers", icon: Users, href: `${base}/customers` },

    { name: "History", icon: History, href: `${base}/history` },
    { name: "Settings", icon: Settings, href: `${base}/settings` },
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white border shadow-sm p-2 rounded-lg"
      >
        <Menu size={22} />
      </button>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
    fixed md:relative
    top-0 left-0
    h-screen md:h-auto
    w-64
    bg-[#FBFBFB]
    z-50
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6">
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
                  transition
                  ${
                    active
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }
                `}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
