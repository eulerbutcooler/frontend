"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
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
  const overallProgress =
    status === "complete" ? 100 : status === "processing" ? 50 : progress / 2;

  return (
    <div className="bg-white rounded-xl border border-hairline p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-body-sm font-semibold text-ink truncate max-w-[80%]">
          {fileName}
        </span>
        <div className="flex items-center gap-2">
          {status === "uploading" && (
            <span className="text-caption text-surface-tint">
              Uploading {Math.round(progress)}%
            </span>
          )}
          {status === "processing" && (
            <span className="text-caption font-semibold text-warning">
              Processing &amp; embedding…
            </span>
          )}
          {status === "complete" && (
            <span className="text-caption text-success font-semibold">
              Ready
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
      <div
        role="progressbar"
        aria-label={`Preparing ${fileName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={status === "processing" ? undefined : overallProgress}
        aria-valuetext={
          status === "processing"
            ? "Upload complete; processing and embedding"
            : status === "complete"
              ? "Ready"
              : undefined
        }
        className="relative h-2 w-full overflow-hidden rounded-full bg-surface-container"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-snappy",
            status === "uploading" && "bg-brand-teal",
            status === "processing" && "bg-success",
            status === "complete" && "bg-success",
            status === "error" && "bg-error"
          )}
          style={{ width: `${Math.min(overallProgress, 100)}%` }}
        />
        {status === "processing" && (
          <div className="absolute inset-y-0 left-1/2 w-1/2 animate-pulse bg-warning/35" />
        )}
      </div>
      {status !== "error" && (
        <div className="mt-1.5 grid grid-cols-2 text-[10px] font-medium text-outline">
          <span className={status !== "uploading" ? "text-success" : undefined}>
            Upload
          </span>
          <span
            className={cn(
              "text-right",
              status === "processing" && "text-warning",
              status === "complete" && "text-success"
            )}
          >
            Process &amp; embed
          </span>
        </div>
      )}
      {status === "error" && errorMessage && (
        <p className="text-caption text-error mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
