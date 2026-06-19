"use client";
import { LayoutDashboard } from "lucide-react";
import { ErrorContent } from "@/components/error-content";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorContent
      error={error}
      reset={reset}
      fallbackHref="/dashboard"
      fallbackLabel="Dashboard"
      FallbackIcon={LayoutDashboard}
      heading="h2"
      wrapperClass="flex-1 flex items-center justify-center p-6"
    />
  );
}
