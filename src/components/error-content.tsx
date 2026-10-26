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
  isEmbedded?: boolean;
}

export function ErrorContent({
  error,
  reset,
  fallbackHref,
  fallbackLabel,
  FallbackIcon,
  heading = "h1",
  isEmbedded = false,
}: ErrorContentProps) {
  useEffect(() => {
    console.error("[Error]", error);
  }, [error]);

  const Heading = heading;

  const content = (
    <div className="max-w-md w-full text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="h-7 w-7 text-rose-600" />
      </div>
      <Heading className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
        Something went wrong
      </Heading>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        {error.message || "An unexpected error occurred while processing your request. Please try again."}
      </p>

      {error.digest && (
        <div className="mb-6 p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500 select-all">
          Digest: {error.digest}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-none"
        >
          <RotateCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href={fallbackHref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-colors shadow-none"
        >
          <FallbackIcon className="h-4 w-4 text-gray-500" />
          {fallbackLabel}
        </Link>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center shadow-none">
        {content}
      </div>
    </div>
  );
}
