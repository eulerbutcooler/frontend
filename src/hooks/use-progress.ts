"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type { CourseProgressData } from "@/types/progress";
import { clientApi } from "@/lib/api-client.client";

export function useProgress(courseId: string, totalLessons: number, initialProgress: CourseProgressData) {
  const [progress, setProgress] = useState<CourseProgressData>(initialProgress);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const markFileViewed = useCallback(async (lessonId: string, fileId: string) => {
    const snapshot = progressRef.current;
    setProgress((prev) => {
      const lesson = prev.lessons[lessonId] ?? {
        is_completed: false,
        completed_at: null,
        viewed_files: {},
      };
      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            ...lesson,
            viewed_files: { ...lesson.viewed_files, [fileId]: true },
          },
        },
      };
    });

    try {
      await clientApi.post(`/api/v1/progress/file/${fileId}`);
      return true;
    } catch {
      setProgress(snapshot);
      return false;
    }
  }, []);

  const markLessonComplete = useCallback(async (lessonId: string) => {
    const snapshot = progressRef.current;
    setProgress((prev) => {
      const lesson = prev.lessons[lessonId] ?? {
        viewed_files: {},
        is_completed: false,
        completed_at: null,
      };
      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            ...lesson,
            is_completed: true,
            completed_at: new Date().toISOString(),
          },
        },
      };
    });

    try {
      await clientApi.post(`/api/v1/progress/lesson/${lessonId}`);
      return true;
    } catch (err) {
      setProgress(snapshot);
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not save lesson progress. Complete the previous lesson first."
      );
      return false;
    }
  }, []);

  const markCourseComplete = useCallback(async () => {
    const snapshot = progressRef.current;
    setProgress((prev) => ({
      ...prev,
      is_completed: true,
      completed_at: new Date().toISOString()
    }));
    try {
      await clientApi.post(`/api/v1/progress/course/${courseId}`);
      return true;
    } catch (err) {
      setProgress(snapshot);
      toast.error(
        err instanceof Error ? err.message : "Could not save course progress."
      );
      return false;
    }
  }, [courseId]);

  const isLessonComplete = useCallback(
    (lessonId: string) => progress.lessons[lessonId]?.is_completed ?? false,
    [progress],
  );

  const isFileViewed = useCallback(
    (lessonId: string, fileId: string) =>
      progress.lessons[lessonId]?.viewed_files?.[fileId] ?? false,
    [progress],
  );

  const isCourseComplete = progress.is_completed;

  // Calculate completion stats (Lessons)
  const completedCount = Object.values(progress.lessons).filter(
    (l) => l.is_completed,
  ).length;
  const percentage =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  return {
    progress,
    markFileViewed,
    markLessonComplete,
    markCourseComplete,
    isLessonComplete,
    isFileViewed,
    isCourseComplete,
    completedCount,
    percentage,
  };
}
