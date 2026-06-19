"use client";
import { Home } from "lucide-react";
import { ErrorContent } from "@/components/error-content";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  return (
    <ErrorContent
      error={error}
      reset={reset}
      fallbackHref="/"
      fallbackLabel="Go Home"
      FallbackIcon={Home}
    />
  );
}
