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
    <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-gray-200 bg-[#f3f4f6] z-10 shrink-0 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        
        {/* Left side tag */}
        <div className="hidden md:flex items-center px-3 py-1 bg-gray-200 rounded-lg border border-gray-300">
          <span className="text-[14px] font-semibold text-gray-800">
            {user.role === "instructor" ? "Instructor's Portal" : "Trainee's Portal"}
          </span>
        </div>
      </div>

      {/* Right side links */}
      <div className="hidden md:flex items-center gap-6">
        <a href="#" className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
          Help
        </a>
        <a href="#" className="text-[14px] font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
          Docs <span className="text-gray-400">↗</span>
        </a>
      </div>
    </header>
  );
}
