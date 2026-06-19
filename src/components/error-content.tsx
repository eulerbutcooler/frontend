"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, type LucideIcon } from "lucide-react";

interface ErrorContentProps {
  error: Error & { digest?: string };
  reset: () => void;
  fallbackHref: string;
  fallbackLabel: string;
  FallbackIcon: LucideIcon;
  heading?: "h1" | "h2";
  wrapperClass?: string;
}

export function ErrorContent({
  error,
  reset,
  fallbackHref,
  fallbackLabel,
  FallbackIcon,
  heading = "h1",
  wrapperClass = "min-h-screen bg-canvas flex items-center justify-center p-6",
}: ErrorContentProps) {
  useEffect(() => {
    console.error("[Error]", error);
  }, [error]);

  const Heading = heading;

  return (
    <div className={wrapperClass}>
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-brand-coral/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-brand-coral" />
        </div>
        <Heading className="font-display text-display-sm text-ink mb-3">
          Something went wrong
        </Heading>
        <p className="text-body-md text-surface-tint mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
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
            href={fallbackHref}
            className="inline-flex items-center gap-2 bg-canvas text-ink h-[44px] px-6 rounded-xl font-button text-button border border-hairline hover:bg-surface-soft transition-colors"
          >
            <FallbackIcon className="h-4 w-4" />
            {fallbackLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
