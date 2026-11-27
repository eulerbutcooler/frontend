"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  ListTodo,
  MessageSquare,
  BarChart,
  Users,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons/Logo";
import { isAdminUser, type User } from "@/types/user";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  instructorOnly?: boolean;
  adminOnly?: boolean;
}

const OVERVIEW_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Quizzes", href: "/quizzes", icon: ListTodo },
  { label: "Chat", href: "/chat", icon: MessageSquare },
];

const ANALYTICS_ITEMS: NavItem[] = [
  { label: "User Insights", href: "/analytics", icon: BarChart, instructorOnly: true },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Users Directory", href: "/users", icon: Users, adminOnly: true },
];

const ACCOUNT_ITEMS: NavItem[] = [
  { label: "Profile", href: "/profile", icon: UserCircle },
];

interface SidebarUser {
  name?: string | null;
  role: string;
  rank: string;
  serviceNumber?: string | null;
  isMaster?: boolean;
}

interface SidebarProps {
  user: SidebarUser;
  className?: string;
}

export function Sidebar({ user, className }: SidebarProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Fallback to /api/v1/users/me if serviceNumber is not directly in user object
  // or if an instructor session was minted before isMaster was added to the JWT.
  const { data: me } = useQuery({
    queryKey: ["users-me"],
    queryFn: () => clientApi.get<User>("/api/v1/users/me"),
    enabled: !user.serviceNumber || (user.role === "instructor" && user.isMaster === undefined),
  });

  const rawServiceNumber = user.serviceNumber || me?.enrollment_id || "";
  const displayServiceNumber = rawServiceNumber ? rawServiceNumber.toUpperCase() : "";
  const isAdmin = isAdminUser({
    role: user.role,
    isMaster: user.isMaster ?? me?.is_master,
    serviceNumber: rawServiceNumber,
  });

  const visibleOverview = OVERVIEW_ITEMS.filter(
    (item) => (!item.instructorOnly || user.role === "instructor") && (!item.adminOnly || isAdmin)
  );
  const visibleAnalytics = ANALYTICS_ITEMS.filter(
    (item) => (!item.instructorOnly || user.role === "instructor") && (!item.adminOnly || isAdmin)
  );
  const visibleAdmin = ADMIN_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const NavGroup = ({ title, items }: { title: string; items: NavItem[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-[10px] font-semibold text-gray-500 tracking-wider mb-2 uppercase px-3">
          {title}
        </h3>
        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150",
                  isActive
                    ? "bg-gradient-to-b from-blue-50/50 to-blue-100/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_1px_2px_rgba(0,0,0,0.05)] text-blue-700"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "h-full w-[240px] border-r border-gray-200 bg-[#f3f4f6] flex flex-col shrink-0 font-sans",
        className
      )}
    >
      {/* Brand Header */}
      <Link
        href="/"
        className="h-14 flex items-center gap-2.5 px-6 shrink-0 mb-4 hover:opacity-80 transition-opacity"
        title="Home"
      >
        <Logo className="h-4 w-auto" />
        <h1 className="text-[16px] font-extrabold text-gray-900 font-display tracking-tight">
          AeroMentor
        </h1>
      </Link>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-4 scrollbar-hide pb-6">
        <NavGroup title="Overview" items={visibleOverview} />
        <NavGroup title="Analytics" items={visibleAnalytics} />
        <NavGroup title="Admin" items={visibleAdmin} />
        <NavGroup title="Account" items={ACCOUNT_ITEMS} />
      </nav>

      {/* Bottom User Profile Card with Grey Logout Button */}
      <div className="mt-auto p-4 bg-[#f3f4f6]">
        <div className="border border-gray-200 rounded-xl p-2 bg-white flex items-center justify-between gap-2 shadow-none">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 min-w-0 flex-1 rounded-lg hover:bg-gray-50 p-0.5 -m-0.5 transition-colors"
            title="View Profile & Change Rank"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-[13px] font-semibold border border-gray-200 shrink-0">
              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 truncate leading-tight">
                {user.name ?? "User"}
              </p>
              {displayServiceNumber && (
                <p className="text-[11px] text-gray-500 font-medium truncate leading-normal">
                  {displayServiceNumber}
                </p>
              )}
            </div>
          </Link>

          {/* Grey color logout button on the right end */}
          <button
            type="button"
            onClick={() => {
              queryClient.clear();
              try {
                localStorage.removeItem("aeromentor_current_user_rank");
              } catch {}
              signOut({ callbackUrl: "/login" });
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0 shadow-none cursor-pointer"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
