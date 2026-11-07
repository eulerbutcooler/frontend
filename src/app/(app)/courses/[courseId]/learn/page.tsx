import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/player/course-player";
import { api } from "@/lib/api-client";
import type { Course, CourseSyllabus, FileAsset } from "@/types/course";
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
  let referenceFiles: FileAsset[] = [];
  let syllabus: CourseSyllabus | null = null;
  let initialProgress: CourseProgressData = {
    course_id: courseId,
    is_completed: false,
    lessons: {}
  };

  try {
    const [fetchedCourse, content, progress, materials, syllabusData] =
      await Promise.all([
        api.get<Course>(`/api/v1/courses/${courseId}`),
        api.get<LessonWithContent[]>(`/api/v1/courses/${courseId}/content`),
        api.get<CourseProgressData>(`/api/v1/courses/${courseId}/progress`).catch(() => initialProgress),
        api.get<FileAsset[]>(`/api/v1/courses/${courseId}/materials`).catch(() => []),
        api.get<CourseSyllabus>(`/api/v1/courses/${courseId}/syllabus`).catch(() => null),
      ]);
    course = fetchedCourse;
    initialProgress = progress || initialProgress;
    if (!initialProgress.lessons) initialProgress.lessons = {};
    referenceFiles = Array.isArray(materials) ? materials : [];
    syllabus = syllabusData;
    lessonsWithContent = Array.isArray(content) ? content : [];
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
        referenceFiles={referenceFiles}
        hasSyllabus={!!syllabus}
      />
    </div>
  );
}
