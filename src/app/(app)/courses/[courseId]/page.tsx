import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowRight, Pencil, ArrowLeft, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonList } from "@/components/course/lesson-list";
import { DeleteCourseButton } from "@/components/course/delete-course-button";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/utils";
import type { Course, Lesson } from "@/types/course";
import { SubjectSyllabusRoadmap, type LessonWithTopics } from "@/components/course/subject-syllabus-roadmap";
import { cleanSubjectDescription } from "@/lib/course-utils";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) return null;

  const isInstructor = session.user.role === "instructor";

  let course: Course;
  let lessons: Lesson[] = [];
  let lessonsWithTopics: LessonWithTopics[] = [];

  try {
    [course, lessons] = await Promise.all([
      api.get<Course>(`/api/v1/courses/${courseId}`),
      api.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`),
    ]);
    lessons = Array.isArray(lessons) ? lessons : [];

    lessonsWithTopics = await Promise.all(
      lessons.map(async (l) => {
        try {
          const topics = await api.get<any[]>(`/api/v1/lessons/${l.id}/topics`);
          return { ...l, topics: Array.isArray(topics) ? topics : [] };
        } catch {
          return { ...l, topics: [] };
        }
      })
    );
  } catch (e) {
    console.error("Failed to fetch course:", e);
    notFound();
  }

  const isCourseAuthor = isInstructor;

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-2 shrink-0">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-[20px] font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Subjects
        </Link>

        <div className="flex items-center gap-3">
          {isCourseAuthor && (
            <Link
              href={`/courses/${courseId}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Pencil className="h-4 w-4" />
              Edit Subject
            </Link>
          )}
        </div>
      </div>

      {/* Giant White Block containing everything */}
      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xs">

        {/* Left Column: Subject Details & Lesson Materials */}
        <div className="w-full md:w-[55%] lg:w-[58%] p-8 overflow-y-auto flex flex-col">
          {isCourseAuthor && !course.published && (
            <div className="mb-6 inline-flex items-start gap-3 bg-yellow-50/50 text-gray-900 rounded-lg px-4 py-3 border border-yellow-100 shrink-0">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
              <p className="text-[13px] text-gray-600">
                This subject is a <span className="font-semibold text-gray-900">draft</span>. Add modules and files below — trainees see it only after you publish.
              </p>
            </div>
          )}

          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight mb-3 shrink-0">
            {course.title}
          </h1>
          <p className="text-gray-500 text-[14px] leading-relaxed mb-6 shrink-0">
            {cleanSubjectDescription(course.description)}
          </p>

          {/* Start Learning Button */}
          <Link
            href={`/courses/${courseId}/learn`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-lg transition-colors mb-8 shrink-0 w-fit shadow-xs hover:shadow-md cursor-pointer"
          >
            <Play className="h-4 w-4" fill="white" />
            Start Learning
          </Link>

          <div className="flex-1 min-h-0 pb-2 flex flex-col justify-start">
            {/* Lessons */}
            <Suspense fallback={<div className="h-40" />}>
              <LessonList
                courseId={courseId}
                lessons={lessons}
                isInstructor={false}
                instructorId={course.instructor_id}
                published={course.published}
              />
            </Suspense>
          </div>
        </div>

        {/* Right Column: AI Executive Summary & Lesson-by-Lesson Syllabus Roadmap */}
        <div className="hidden md:block md:w-[45%] lg:w-[42%] h-full overflow-hidden">
          <SubjectSyllabusRoadmap course={course} lessons={lessonsWithTopics} />
        </div>

      </div>
    </div>
  );
}
