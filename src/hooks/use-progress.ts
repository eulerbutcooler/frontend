"use client";

import { useState, useCallback } from "react";
import type { CourseProgressData } from "@/types/progress";
import { clientApi } from "@/lib/api-client.client";

export function useProgress(courseId: string, totalLessons: number, initialProgress: CourseProgressData) {
  const [progress, setProgress] = useState<CourseProgressData>(initialProgress);

  const markFileViewed = useCallback((lessonId: string, fileId: string) => {
    // Optimistic update
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

    // Call backend API (fire and forget)
    clientApi.post(`/api/v1/progress/file/${fileId}`).catch(console.error);
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    // Optimistic update
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

    // Call backend API
    clientApi.post(`/api/v1/progress/lesson/${lessonId}`).catch(console.error);
  }, []);

  const markCourseComplete = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      is_completed: true,
      completed_at: new Date().toISOString()
    }));
    clientApi.post(`/api/v1/progress/course/${courseId}`).catch(console.error);
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
