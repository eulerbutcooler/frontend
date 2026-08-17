import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-canvas flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-lavender/15 rounded-full blur-3xl -z-10" />
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-[120px] leading-none text-ink mb-4">
          404
        </h1>
        <h2 className="font-display text-display-sm text-ink mb-3">
          Page not found
        </h2>
        <p className="text-body-md text-surface-tint mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
