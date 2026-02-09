"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar slug={slug} onLogout={() => router.push("/access")} />

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

/* ---------------- TOPBAR ---------------- */

function Topbar({ slug, onLogout }: { slug: string; onLogout: () => void }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link
            href={`/business/${slug}/dashboard`}
            className="font-bold text-lg"
          >
            fg-loyalty
          </Link>

          <nav className="hidden sm:flex gap-4 text-sm">
            <NavLink href={`/business/${slug}/dashboard`}>Dashboard</NavLink>
            <NavLink href={`/business/${slug}/dashboard/customers`}>
              Customers
            </NavLink>
            <NavLink href={`/business/${slug}/dashboard/settings`}>
              Settings
            </NavLink>
          </nav>
        </div>

        {/* RIGHT */}
        <ProfileMenu slug={slug} onLogout={onLogout} />
      </div>
    </header>
  );
}

/* ---------------- PROFILE MENU ---------------- */

function ProfileMenu({
  slug,
  onLogout,
}: {
  slug: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // cerrar al click afuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function logout() {
    // borra cookie de sesión
    await fetch("/api/logout", { method: "POST" });
    onLogout();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1"
      >
        {slug.replace("-", " ")}
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-sm">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- NAV LINK ---------------- */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-gray-600 hover:text-black transition">
      {children}
    </Link>
  );
}
