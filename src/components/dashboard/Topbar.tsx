// components/dashboard/Topbar.tsx
import Link from "next/link";
import { QrCode } from "lucide-react";

export default function Topbar({ slug }: { slug: string }) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>

        <Link
          href={`/business/${slug}/dashboard/scan`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A2540] px-4 py-2 text-white text-sm font-medium hover:opacity-95"
        >
          <QrCode size={18} />
          Scan
        </Link>
      </div>
    </header>
  );
}
