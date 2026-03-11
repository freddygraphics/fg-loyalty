// components/dashboard/DashboardShell.tsx

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  return (
    <div className="bg-white flex flex-col">
      {/* TOPBAR */}
      <Topbar slug={slug} />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar slug={slug} />

        {/* CONTENT */}
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
