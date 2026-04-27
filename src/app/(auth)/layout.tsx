import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-10">
          <h1 className="font-display text-[28px] font-bold tracking-tight text-ink">
            AeroMentor
          </h1>
          <p className="text-[13px] font-semibold tracking-[1.5px] uppercase text-outline mt-1">
            Naval Aviation Training
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
