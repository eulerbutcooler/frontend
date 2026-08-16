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
    <div className="flex h-dvh bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-button"
      >
        Skip to content
      </a>
      <div className="hidden md:flex">
        <Sidebar user={user} />
      </div>

      <SidebarOverlay user={user} />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar user={user} />

        <main id="main-content" className="flex-1 overflow-y-auto p-6 md:p-12 pt-20 md:pt-12 focus-visible:outline-none" tabIndex={-1}>
          <div className="max-w-[1280px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
