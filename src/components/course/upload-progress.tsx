"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";

export type UploadProgressStatus = "queued" | "uploading" | "uploaded" | "error";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: UploadProgressStatus;
  onCancel?: () => void;
  onDismiss?: () => void;
  errorMessage?: string;
}

export function UploadProgress({
  fileName,
  progress,
  status,
  onCancel,
  onDismiss,
  errorMessage,
}: UploadProgressProps) {
  const isFinalizingUpload = status === "uploading" && progress >= 99.5;

  return (
    <div className="animate-fade-in rounded-2xl border border-hairline bg-white p-4 shadow-sm">
      <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-ink">{fileName}</p>
          <p className="mt-0.5 text-caption text-surface-tint">
            {status === "queued" && "Queued — waiting for an upload slot"}
            {status === "uploading" &&
              (isFinalizingUpload
                ? "Securing the uploaded file…"
                : `Uploading file · ${Math.round(progress)}%`)}
            {status === "uploaded" &&
              "Uploaded — text extraction and indexing continue in the background"}
            {status === "error" && (errorMessage || "File preparation failed")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {status === "uploading" && (
            <Loader2 className="size-4 animate-spin text-brand-teal" />
          )}
          {status === "uploaded" && (
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
          {(status === "error" || status === "uploaded") && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label={`Dismiss ${fileName}`}
              className="grid size-7 place-items-center rounded-lg text-surface-tint transition-colors hover:bg-surface-strong hover:text-ink focus-ring"
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
          status === "uploading"
            ? Math.round(progress)
            : status === "uploaded"
              ? 100
              : status === "queued"
                ? 0
                : undefined
        }
        aria-valuetext={
          status === "queued"
            ? "Queued"
            : status === "uploaded"
              ? "Uploaded; indexing continues in the background"
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
            style={{
              width: `${
                status === "uploading"
                  ? Math.min(progress, 100)
                  : status === "uploaded"
                    ? 100
                    : 0
              }%`,
            }}
          />
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-container">
          {status === "uploaded" && (
            <div className="absolute inset-y-0 w-1/2 animate-progress-sweep rounded-full bg-warning" />
          )}
          {status === "error" && <div className="h-full w-full rounded-full bg-error/35" />}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
        <span
          className={cn(
            status === "uploading" || status === "queued"
              ? "text-brand-teal"
              : "text-success",
            status === "error" && "text-error"
          )}
        >
          {status === "uploading"
            ? "1 · Uploading"
            : status === "queued"
              ? "1 · Queued"
              : status === "error"
                ? "1 · Failed"
                : "1 · Uploaded"}
        </span>
        <span
          className={cn(
            "text-right",
            status === "uploaded" && "text-warning",
            status === "error" && "text-outline",
            status === "queued" && "text-outline"
          )}
        >
          {status === "uploaded" ? "2 · Indexing" : "2 · Process & index"}
        </span>
      </div>
    </div>
  );
}
