import { useQueries } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { FileAsset, Lesson } from "@/types/course";

export interface CourseFilesSummary {
  total: number;
  ready: number;
  processing: number;
  failed: number;
  /** True when there is at least one file and every file has finished ingesting successfully. */
  allReady: boolean;
  /** True while any file is still pending/processing. */
  busy: boolean;
}

/**
 * Aggregates ingest status across every file in every lesson of a course.
 * Always polls every 3 seconds while mounted so the publish bar and file
 * list react to uploads and ingest completions without waiting for a
 * full page refresh.
 */
export function useCourseFiles(lessons: Lesson[]): CourseFilesSummary {
  const results = useQueries({
    queries: lessons.map((lesson) => ({
      queryKey: ["files", lesson.id],
      queryFn: () =>
        clientApi.get<FileAsset[]>(`/api/v1/lessons/${lesson.id}/files`),
      refetchInterval: 3000,
    })),
  });

  const files = results.flatMap((r) => r.data ?? []);
  const total = files.length;
  const ready = files.filter((f) => f.ingest_status === "ready").length;
  const failed = files.filter((f) => f.ingest_status === "failed").length;
  const processing = files.filter(
    (f) => f.ingest_status === "pending" || f.ingest_status === "processing"
  ).length;

  return {
    total,
    ready,
    processing,
    failed,
    allReady: total > 0 && ready === total,
    busy: processing > 0,
  };
}
