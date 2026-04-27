"use client";

import { useUIStore } from "@/stores/ui-store";
import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { X } from "lucide-react";

interface SidebarOverlayProps {
  user: {
    name?: string | null;
    role: string;
    rank: string;
  };
}

export function SidebarOverlay({ user }: SidebarOverlayProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const isOpen = !sidebarCollapsed;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (sidebarCollapsed) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setSidebarCollapsed(true)}
      />
      <div className="relative h-full w-64 animate-slide-in-left">
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-strong transition-colors"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4 text-ink" />
        </button>
        <Sidebar user={user} />
      </div>
    </div>
  );
}
