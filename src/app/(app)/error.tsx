"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, LayoutDashboard, RotateCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-brand-coral/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-brand-coral" />
        </div>
        <h2 className="font-display text-display-sm text-ink mb-3">
          Something went wrong
        </h2>
        <p className="text-body-md text-surface-tint mb-8">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-ink text-white h-[44px] px-6 rounded-xl font-button text-button hover:opacity-90 transition-opacity"
          >
            <RotateCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-canvas text-ink h-[44px] px-6 rounded-xl font-button text-button border border-hairline hover:bg-surface-soft transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
