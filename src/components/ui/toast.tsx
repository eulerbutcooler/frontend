"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn, cva, type VariantProps } from "@/lib/utils";
import { X } from "lucide-react";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border border-hairline bg-white p-4 shadow-lg animate-slide-up",
  {
    variants: {
      variant: {
        default: "border-l-4 border-l-ink",
        success: "border-l-4 border-l-success",
        error: "border-l-4 border-l-error",
        warning: "border-l-4 border-l-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ToastVariant = VariantProps<typeof toastVariants>["variant"];

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (data: Omit<ToastData, "id">) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((data: Omit<ToastData, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...data, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(toastVariants({ variant: t.variant }))}
            onOpenChange={(open) => {
              if (!open) removeToast(t.id);
            }}
          >
            <div className="flex-1">
              <ToastPrimitive.Title className="font-sans text-title-md font-semibold text-ink">
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="font-sans text-body-sm text-surface-tint mt-1">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="text-outline hover:text-ink transition-colors cursor-pointer">
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-6 right-6 z-[100] flex max-w-sm flex-col gap-3" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
