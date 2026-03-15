import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({
  children,
  slug,
  businessName,
}: {
  children: React.ReactNode;
  slug: string;
  businessName: string;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* TOPBAR */}
      <Topbar businessName={businessName} slug={slug} />

      {/* LAYOUT */}
      <div className="flex">
        {/* SIDEBAR */}
        <Sidebar slug={slug} />

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
