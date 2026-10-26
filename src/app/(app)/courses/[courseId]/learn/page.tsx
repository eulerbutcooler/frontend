import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/player/course-player";
import { api } from "@/lib/api-client";
import type { Course, Lesson } from "@/types/course";
import type { LessonWithContent, CourseProgressData } from "@/types/progress";

import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function LearnPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  const isInstructor = session?.user?.role === "instructor";

  let course: Course;
  let lessonsWithContent: LessonWithContent[] = [];
  let initialProgress: CourseProgressData = {
    course_id: courseId,
    is_completed: false,
    lessons: {}
  };

  try {
    const [fetchedCourse, lessons, quizzes, progress] = await Promise.all([
      api.get<Course>(`/api/v1/courses/${courseId}`),
      api.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`),
      api.get<any[]>(`/api/v1/courses/${courseId}/quizzes`),
      api.get<CourseProgressData>(`/api/v1/courses/${courseId}/progress`).catch(() => initialProgress), // Default to empty if not found
    ]);
    course = fetchedCourse;
    initialProgress = progress || initialProgress;
    if (!initialProgress.lessons) initialProgress.lessons = {};

    const safeLessons = Array.isArray(lessons) ? lessons : [];
    const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];

    const lessonsWithContentPromises = safeLessons.map(async (lesson) => {
      const [files, topics] = await Promise.all([
        api.get<any[]>(`/api/v1/lessons/${lesson.id}/files`).catch(() => []),
        api.get<any[]>(`/api/v1/lessons/${lesson.id}/topics`).catch(() => []),
      ]);
      const safeFiles = Array.isArray(files) ? files : [];
      const safeTopics = Array.isArray(topics) ? topics : [];
      // Find quiz for this lesson
      const quiz = safeQuizzes.find((q) => q.lesson_id === lesson.id) || null;
      return { ...lesson, files: safeFiles, topics: safeTopics, quiz } as LessonWithContent;
    });
    lessonsWithContent = await Promise.all(lessonsWithContentPromises);
  } catch (e) {
    console.error("Failed to fetch data for learn page:", e);
    notFound();
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 px-2 shrink-0">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-[20px] font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Course
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500">
            {course.title}
          </span>
        </div>
      </div>

      {/* Big white container — course player fills this */}
      <CoursePlayer
        courseId={courseId}
        courseTitle={course.title}
        lessons={lessonsWithContent}
        initialProgress={initialProgress}
        isInstructor={isInstructor}
      />
    </div>
  );
}
