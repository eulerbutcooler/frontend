"use client";

import { useIngestStatus } from "@/hooks/use-ingest-status";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { IngestStatus } from "@/types/course";

const STATUS_STYLES: Record<
  IngestStatus,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-surface-card",
    text: "text-surface-tint",
    label: "Pending",
  },
  processing: {
    bg: "bg-warning/10",
    text: "text-warning",
    label: "Processing",
  },
  ready: {
    bg: "bg-success/10",
    text: "text-success",
    label: "Ready",
  },
  failed: {
    bg: "bg-error/10",
    text: "text-error",
    label: "Failed",
  },
};

interface IngestStatusBadgeProps {
  fileId: string;
  initialStatus: IngestStatus;
}

export function IngestStatusBadge({
  fileId,
  initialStatus,
}: IngestStatusBadgeProps) {
  const shouldPoll = initialStatus === "pending" || initialStatus === "processing";
  const { data } = useIngestStatus(shouldPoll ? fileId : null);
  const status = data?.status ?? initialStatus;
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium",
        style.bg,
        style.text,
        status === "processing" && "animate-pulse-slow"
      )}
    >
      {status === "processing" && (
        <Loader2 className="h-3 w-3 animate-spin" />
      )}
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  );
}
