"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  onCancel?: () => void;
  errorMessage?: string;
}

export function UploadProgress({
  fileName,
  progress,
  status,
  onCancel,
  errorMessage,
}: UploadProgressProps) {
  return (
    <div className="bg-white rounded-xl border border-hairline p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-body-sm font-semibold text-ink truncate max-w-[80%]">
          {fileName}
        </span>
        <div className="flex items-center gap-2">
          {status === "uploading" && (
            <span className="text-caption text-surface-tint">
              {Math.round(progress)}%
            </span>
          )}
          {status === "complete" && (
            <span className="text-caption text-success font-semibold">
              Complete
            </span>
          )}
          {status === "error" && (
            <span className="text-caption text-error font-semibold">
              Failed
            </span>
          )}
          {status === "uploading" && onCancel && (
            <button
              onClick={onCancel}
              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-surface-strong transition-colors text-surface-tint hover:text-error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            status === "uploading" && "bg-brand-teal",
            status === "complete" && "bg-success",
            status === "error" && "bg-error"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {status === "error" && errorMessage && (
        <p className="text-caption text-error mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
