"use client";

import { LayoutDashboard } from "lucide-react";
import { ErrorContent } from "@/components/error-content";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorPageProps) {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide flex items-center justify-center">
        <ErrorContent
          error={error}
          reset={reset}
          fallbackHref="/dashboard"
          fallbackLabel="Return to Dashboard"
          FallbackIcon={LayoutDashboard}
          heading="h2"
          isEmbedded={true}
        />
      </div>
    </div>
  );
}
