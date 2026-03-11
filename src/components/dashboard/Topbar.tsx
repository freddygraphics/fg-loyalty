"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Topbar({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#ededed] ">
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href={`/business/${slug}/dashboard`}
          className="text-lg font-semibold text-gray-900"
        >
          Fideliza{" "}
        </Link>

        {/* Admin Menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            Admin
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-[#ededed] rounded-lg shadow-sm">
              <Link
                href={`/business/${slug}/billing`}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Billing
              </Link>

              <Link
                href="/logout"
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
