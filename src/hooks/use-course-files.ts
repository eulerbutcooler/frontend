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
 * Polls quickly while any file is processing, and slowly while idle so the
 * publish bar still notices files created by the async upload hook.
 */
export function useCourseFiles(
  lessons: Lesson[],
  extraLessonId?: string
): CourseFilesSummary {
  const lessonIds = Array.from(
    new Set([
      ...lessons.map((lesson) => lesson.id),
      ...(extraLessonId ? [extraLessonId] : []),
    ])
  );
  const results = useQueries({
    queries: lessonIds.map((lessonId) => ({
      queryKey: ["files", lessonId],
      queryFn: () =>
        clientApi.get<FileAsset[]>(`/api/v1/lessons/${lessonId}/files`),
      refetchInterval: (query: { state: { data?: FileAsset[] } }) => {
        const files = query.state.data ?? [];
        const busy = files.some(
          (file) =>
            file.ingest_status === "pending" || file.ingest_status === "processing"
        );
        // Slow idle poll catches files created by the async TUS completion
        // hook even when no upload is currently in flight.
        return busy ? 1500 : 10000;
      },
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
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
