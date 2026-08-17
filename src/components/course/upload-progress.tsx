"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";

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
  const [processingSeconds, setProcessingSeconds] = useState(0);
  const isFinalizingUpload = status === "uploading" && progress >= 99.5;

  useEffect(() => {
    if (status !== "processing") return;

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setProcessingSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const elapsed =
    processingSeconds >= 60
      ? `${Math.floor(processingSeconds / 60)}m ${processingSeconds % 60}s`
      : `${processingSeconds}s`;

  return (
    <div className="animate-fade-in rounded-2xl border border-hairline bg-white p-4 shadow-sm">
      <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-ink">{fileName}</p>
          <p className="mt-0.5 text-caption text-surface-tint">
            {status === "uploading" &&
              (isFinalizingUpload
                ? "Securing the uploaded file…"
                : `Uploading file · ${Math.round(progress)}%`)}
            {status === "processing" &&
              `Extracting text and creating the search index · ${elapsed}`}
            {status === "complete" && "Ready for course publishing"}
            {status === "error" && (errorMessage || "File preparation failed")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {status === "processing" && (
            <Loader2 className="size-4 animate-spin text-warning" />
          )}
          {status === "complete" && (
            <span className="grid size-6 place-items-center rounded-full bg-success/10 text-success">
              <Check className="size-3.5" />
            </span>
          )}
          {status === "uploading" && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label={`Cancel upload of ${fileName}`}
              className="grid size-7 place-items-center rounded-lg text-surface-tint transition-colors hover:bg-surface-strong hover:text-error focus-ring"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div
        role="progressbar"
        aria-label={`Preparing ${fileName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={
          status === "uploading" ? Math.round(progress / 2) : status === "complete" ? 100 : undefined
        }
        aria-valuetext={
          status === "processing"
            ? `Upload complete; processing and embedding for ${elapsed}`
            : status === "complete"
              ? "Ready"
              : undefined
        }
        className="grid grid-cols-2 gap-1.5"
      >
        <div className="h-2 overflow-hidden rounded-full bg-surface-container">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-300 ease-snappy",
              status === "error" ? "bg-error" : "bg-brand-teal"
            )}
            style={{ width: `${status === "uploading" ? Math.min(progress, 100) : 100}%` }}
          />
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-container">
          {status === "processing" && (
            <div className="absolute inset-y-0 w-1/2 animate-progress-sweep rounded-full bg-warning" />
          )}
          {status === "complete" && <div className="h-full w-full rounded-full bg-success" />}
          {status === "error" && <div className="h-full w-full rounded-full bg-error/35" />}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
        <span className={status === "uploading" ? "text-brand-teal" : "text-success"}>
          {status === "uploading" ? "1 · Uploading" : "1 · Uploaded"}
        </span>
        <span
          className={cn(
            "text-right",
            status === "processing" && "text-warning",
            status === "complete" && "text-success",
            (status === "uploading" || status === "error") && "text-outline"
          )}
        >
          {status === "complete" ? "2 · Indexed" : "2 · Process & index"}
        </span>
      </div>
    </div>
  );
}
