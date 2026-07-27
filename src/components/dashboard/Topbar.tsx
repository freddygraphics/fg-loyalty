"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

export default function Topbar({
  businessName,
  slug,
}: {
  businessName: string;
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function logout() {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No fue posible cerrar la sesión.");
      }

      setOpen(false);
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  }

  function openBillingPortal() {
    setOpen(false);
    window.location.assign(`/api/stripe/portal?slug=${slug}`);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e8e8e8] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/business/${slug}/dashboard`}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
            F
          </span>

          <span className="text-lg font-bold tracking-tight text-gray-950">
            Fideliza
          </span>
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-haspopup="menu"
            className="flex max-w-[190px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
          >
            <span className="truncate">{businessName}</span>

            <ChevronDown
              size={16}
              className={`shrink-0 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#e8e8e8] bg-white p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
            >
              <Link
                href={`/business/${slug}/dashboard/account`}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
              >
                <UserRound size={17} />
                Account
              </Link>
              <button
                type="button"
                onClick={openBillingPortal}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
              >
                <CreditCard size={17} />
                Manage Billing
              </button>

              <Link
                href={`/business/${slug}/dashboard/settings`}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
              >
                <Settings size={17} />
                Settings
              </Link>

              <div className="my-1 border-t border-gray-100" />

              <button
                type="button"
                onClick={logout}
                disabled={loading}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={17} />

                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
