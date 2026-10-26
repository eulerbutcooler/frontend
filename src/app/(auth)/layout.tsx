import type { ReactNode } from "react";
import { Logo } from "@/components/icons/Logo";
import Link from "next/link";
import Image from "next/image";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { FactCard } from "@/components/ui/fact-card";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#f5f5f5] text-[#0a0a0a]">
      {/* Left Column: Form */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="flex items-center gap-3 mb-12 text-[#0a0a0a] hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
            <span className="font-display text-[32px] font-bold tracking-tight">
              AeroMentor
            </span>
          </Link>

          <div className="mb-10">
            <h1 className="font-display text-[36px] font-bold tracking-tight mb-3">
              Your training awaits
            </h1>
            <p className="text-body-md text-surface-tint">
              Sign in or create an account to get started.
            </p>
          </div>

          {children}
        </div>
      </div>

      {/* Right Column: Media (hidden on small screens) */}
      <div className="hidden lg:block lg:w-[55%] p-4 pl-0">
        <div className="relative w-full h-full rounded-[32px] overflow-hidden">
          <ParallaxImage src="/images/untitled.webp" alt="Suk Background" />
          {/* Overlay card */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <FactCard />
          </div>
        </div>
      </div>
    </div>
  );
}
