import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarOverlay } from "@/components/layout/sidebar-overlay";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = {
    name: session.user.name,
    role: session.user.role,
    rank: session.user.rank,
  };

  return (
    <div className="flex h-screen bg-canvas">
      <div className="hidden md:flex">
        <Sidebar user={user} />
      </div>

      <SidebarOverlay user={user} />

      <div className="flex flex-col flex-1 md:ml-64 min-w-0">
        <Topbar user={user} />

        <main className="flex-1 overflow-y-auto p-6 md:p-12 pt-20 md:pt-12">
          <div className="max-w-[1280px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
