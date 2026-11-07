import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { FileAsset } from "@/types/course";
import type { LessonWithContent } from "@/types/progress";

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

function summarize(files: FileAsset[]): Omit<CourseFilesSummary, "allReady" | "busy"> {
  return {
    total: files.length,
    ready: files.filter((f) => f.ingest_status === "ready").length,
    failed: files.filter((f) => f.ingest_status === "failed").length,
    processing: files.filter(
      (f) => f.ingest_status === "pending" || f.ingest_status === "processing"
    ).length,
  };
}

/**
 * Aggregates ingest status across every file in every lesson of a course.
 *
 * This uses the single course-content endpoint instead of one request per
 * lesson. It polls only while something is processing; idle courses are not
 * polled continuously.
 */
export function useCourseFiles(
  courseId: string,
  extraLessonId?: string
): CourseFilesSummary {
  const contentQuery = useQuery({
    queryKey: ["course-content", courseId],
    queryFn: () =>
      clientApi.get<LessonWithContent[]>(`/api/v1/courses/${courseId}/content`),
    refetchInterval: (query: { state: { data?: LessonWithContent[] } }) => {
      const lessons = query.state.data ?? [];
      const files = lessons.flatMap((lesson) => lesson.files ?? []);
      return files.some(
        (file) =>
          file.ingest_status === "pending" || file.ingest_status === "processing"
      )
        ? 1500
        : 15000;
    },
    refetchOnWindowFocus: true,
  });

  const materialQuery = useQuery({
    queryKey: ["files", extraLessonId],
    queryFn: () =>
      clientApi.get<FileAsset[]>(`/api/v1/lessons/${extraLessonId}/files`),
    enabled: !!extraLessonId,
    refetchInterval: (query: { state: { data?: FileAsset[] } }) => {
      const files = query.state.data ?? [];
      return files.some(
        (file) =>
          file.ingest_status === "pending" || file.ingest_status === "processing"
      )
        ? 1500
        : 15000;
    },
    refetchOnWindowFocus: true,
  });

  const contentFiles = (contentQuery.data ?? []).flatMap(
    (lesson) => lesson.files ?? []
  );
  const materialFiles = materialQuery.data ?? [];
  const summary = summarize([...contentFiles, ...materialFiles]);

  return {
    ...summary,
    allReady: summary.total > 0 && summary.ready === summary.total,
    busy: summary.processing > 0,
  };
}
