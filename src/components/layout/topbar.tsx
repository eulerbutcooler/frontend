"use client";

import { useUIStore } from "@/stores/ui-store";
import { signOut } from "next-auth/react";
import { Menu, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TopbarUser {
  name?: string | null;
  role: string;
}

interface TopbarProps {
  user: TopbarUser;
}

export function Topbar({ user }: TopbarProps) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <nav className="fixed top-0 w-full z-40 border-b border-hairline bg-canvas flex items-center justify-between h-16 px-6 md:hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-strong transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5 text-ink" />
        </button>
        <span className="text-title-md font-bold tracking-tight text-ink font-display">
          AeroMentor
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center text-white text-caption font-semibold">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-3 py-2">
            <p className="text-body-sm font-semibold text-ink">
              {user.name ?? "User"}
            </p>
            <p className="text-caption text-surface-tint capitalize">
              {user.role}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-error focus:text-error"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
