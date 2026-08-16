"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, BookOpen, ClipboardList, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  instructorOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Quizzes", href: "/quizzes", icon: ClipboardList },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Analytics", href: "/analytics", icon: BarChart3, instructorOnly: true },
];;

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
        "h-full w-64 border-r border-hairline bg-surface-card flex flex-col shrink-0",
        className
      )}
    >
      <div className="p-6 border-b border-hairline">
        <div>
          <p className="text-title-md font-semibold text-ink font-display" aria-hidden="true">
            AeroMentor
          </p>
          <p className="text-caption-uppercase uppercase text-surface-tint">
            {user.role === "instructor" ? "Instructor" : "Cadet"} Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col p-4 gap-1 overflow-y-auto" aria-label="Main navigation">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "focus-ring flex items-center gap-3 px-4 py-3 rounded-xl text-button transition-[color,background-color] duration-150",
                isActive
                  ? "bg-ink text-white"
                  : "text-surface-tint [@media(hover:hover)and(pointer:fine)]:hover:bg-surface-strong"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-white" : "text-surface-tint"
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-hairline">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-brand-teal flex items-center justify-center text-white text-caption font-semibold" aria-hidden="true">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-md font-semibold text-ink truncate">
              {user.name ?? "User"}
            </p>
            <p className="mt-0.5 text-caption font-medium text-surface-tint">
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="focus-ring flex items-center gap-3 px-4 py-2.5 rounded-xl text-surface-tint hover:bg-surface-strong hover:text-error w-full transition-[color,background-color,transform] duration-150 ease-snappy active:scale-[0.97] text-button cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
