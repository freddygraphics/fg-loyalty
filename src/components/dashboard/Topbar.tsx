"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Topbar({
  businessName,
  slug,
}: {
  businessName: string;
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // redirect limpio
      window.location.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const openBillingPortal = () => {
    window.location.href = `/api/stripe/portal?slug=${slug}`;
  };

  return (
    <div className="w-full border-b border-[#ededed] bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* LEFT */}
        <div className="font-semibold text-lg">Fideliza</div>

        {/* RIGHT */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm font-medium"
          >
            {businessName}
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ededed] rounded-lg shadow-lg">
              <button
                onClick={openBillingPortal}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Manage Billing
              </button>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
