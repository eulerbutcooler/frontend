"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  glyph: string;
  instructorOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", glyph: "D" },
  { label: "Courses", href: "/courses", glyph: "C" },
  { label: "Quizzes", href: "/quizzes", glyph: "Q" },
  { label: "Chat", href: "/chat", glyph: "AI" },
  {
    label: "Analytics",
    href: "/analytics",
    glyph: "A",
    instructorOnly: true,
  },
];

interface SidebarUser {
  name?: string | null;
  role: string;
  rank: string;
}

interface SidebarProps {
  user: SidebarUser;
  className?: string;
}

export function Sidebar({ user, className }: SidebarProps) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.instructorOnly || user.role === "instructor"
  );

  return (
    <aside
      className={cn(
        "h-full w-64 border-r border-hairline bg-surface-card flex flex-col flex-shrink-0",
        className
      )}
    >
      <div className="p-6 border-b border-hairline">
        <div>
          <h1 className="text-title-md font-semibold text-ink font-display">
            AeroMentor
          </h1>
          <p className="text-caption-uppercase uppercase text-surface-tint">
            {user.role === "instructor" ? "Instructor" : "Cadet"} Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col p-4 gap-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-button font-semibold transition-all duration-200 active:scale-[0.98]",
                isActive
                  ? "bg-ink text-white"
                  : "text-surface-tint hover:bg-surface-strong hover:translate-x-0.5 group"
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold font-display tracking-tight shrink-0",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-surface-container text-surface-tint group-hover:bg-surface-strong group-hover:text-ink"
                )}
              >
                {item.glyph}
              </span>
              <span className={cn(!isActive && "group-hover:text-ink")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-hairline">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center text-white text-caption font-semibold">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-ink truncate">
              {user.name ?? "User"}
            </p>
            <Badge variant="default" className="mt-0.5 text-[10px] px-1.5 py-0">
              {user.role}
            </Badge>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-surface-tint hover:bg-surface-strong hover:text-error w-full transition-colors text-button font-semibold group"
        >
          <LogOut className="h-4 w-4 group-hover:text-error" />
          <span className="group-hover:text-error">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
