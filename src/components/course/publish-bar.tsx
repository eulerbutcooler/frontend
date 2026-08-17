"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
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
  // useSyncExternalStore returns false during server render and true after
  // hydration, which is exactly the "mounted" semantic without the
  // setState-in-effect pattern the React Hooks rule flags.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { total, ready, processing, failed, allReady } = summary;

  let hint = "";
  if (total === 0) {
    hint = "Upload at least one file before publishing.";
  } else if (failed > 0) {
    hint = `${failed} file${failed === 1 ? "" : "s"} failed — remove or re-upload to continue.`;
  } else if (processing > 0) {
    hint = `${processing} file${processing === 1 ? "" : "s"} still processing…`;
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
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        aria-live="polite"
        className={`inline-flex w-fit max-w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm ${
          failed > 0
            ? "border-error/25 bg-error/5"
            : processing > 0
              ? "border-warning/25 bg-warning/5"
              : allReady
                ? "border-success/25 bg-success/5"
                : "border-hairline bg-surface-card"
        }`}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/70">
          {failed > 0 ? (
            <AlertTriangle className="size-4.5 text-error" />
          ) : processing > 0 ? (
            <Loader2 className="size-4.5 animate-spin text-warning" />
          ) : allReady ? (
            <CheckCircle2 className="size-4.5 text-success" />
          ) : (
            <Rocket className="size-4.5 text-surface-tint" />
          )}
        </span>
        <div className="min-w-0 pr-1">
          <p className="text-body-sm font-semibold text-ink">
            {allReady
              ? `${ready} file${ready === 1 ? "" : "s"} ready to publish`
              : failed > 0
                ? `${failed} file${failed === 1 ? "" : "s"} need attention`
                : processing > 0
                  ? `${processing} of ${total} file${total === 1 ? "" : "s"} processing`
                  : "Course not ready to publish"}
          </p>
          {(hint || error) && (
            <p
              className={`mt-0.5 text-caption ${error || failed > 0 ? "text-error" : "text-surface-tint"}`}
            >
              {error || hint}
            </p>
          )}
        </div>
      </div>

      <Button
        className="w-full shrink-0 gap-2 shadow-sm sm:w-auto"
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
  );
}
