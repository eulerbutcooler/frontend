"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, AlertTriangle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinalizeCourse } from "@/hooks/use-courses";
import type { CourseFilesSummary } from "@/hooks/use-course-files";

interface PublishBarProps {
  courseId: string;
  published: boolean;
  summary: CourseFilesSummary;
}

/**
 * Sticky footer that gates course publishing on file ingestion.
 * Publishing is the single explicit trigger for quiz generation
 * (backend Finalize), so it stays disabled until every uploaded
 * file has finished ingesting.
 */
export function PublishBar({ courseId, published, summary }: PublishBarProps) {
  const router = useRouter();
  const finalizeCourse = useFinalizeCourse();
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { total, ready, processing, failed, allReady } = summary;

  let hint = "";
  if (total === 0) {
    hint = "Upload at least one file before publishing.";
  } else if (processing > 0) {
    hint = `${processing} file${processing === 1 ? "" : "s"} still processing…`;
  } else if (failed > 0) {
    hint = `${failed} file${failed === 1 ? "" : "s"} failed — remove or re-upload to continue.`;
  }

  const canPublish = mounted && allReady && !finalizeCourse.isPending;

  const handlePublish = async () => {
    setError("");
    try {
      await finalizeCourse.mutateAsync(courseId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish.");
    }
  };

  return (
    <div className="sticky bottom-0 z-30 -mx-6 md:-mx-8 mt-8 border-t border-hairline bg-white/90 backdrop-blur-md px-6 md:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {failed > 0 ? (
            <AlertTriangle className="h-5 w-5 text-error shrink-0" />
          ) : processing > 0 ? (
            <Loader2 className="h-5 w-5 text-warning animate-spin shrink-0" />
          ) : allReady ? (
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
          ) : (
            <Rocket className="h-5 w-5 text-surface-tint shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-body-sm font-semibold text-ink">
              {total} file{total === 1 ? "" : "s"} · {ready} ready
              {processing > 0 && ` · ${processing} processing`}
              {failed > 0 && ` · ${failed} failed`}
            </p>
            {(hint || error) && (
              <p
                className={`text-caption mt-0.5 ${error || failed > 0 ? "text-error" : "text-surface-tint"}`}
              >
                {error || hint}
              </p>
            )}
          </div>
        </div>

        <Button
          className="gap-2 shrink-0"
          disabled={!canPublish}
          onClick={handlePublish}
        >
          {finalizeCourse.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          {finalizeCourse.isPending
            ? "Publishing…"
            : published
              ? "Re-publish & Regenerate Quizzes"
              : "Publish Course"}
        </Button>
      </div>
    </div>
  );
}
