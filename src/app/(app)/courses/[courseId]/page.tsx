import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowRight, Pencil, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonList } from "@/components/course/lesson-list";
import { DeleteCourseButton } from "@/components/course/delete-course-button";
import { capitalize } from "@/lib/utils";
import type { Course, Lesson } from "@/types/course";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const isInstructor = session.user.role === "instructor";

  let course: Course;
  let lessons: Lesson[] = [];

  try {
    [course, lessons] = await Promise.all([
      api.get<Course>(`/api/v1/courses/${courseId}`),
      api.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`),
    ]);
  } catch {
    notFound();
  }

  const isCourseAuthor = isInstructor && course.instructor_id === session.user.id;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-button font-semibold text-surface-tint hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-full mb-6 border border-hairline">
            <span className={`w-2 h-2 rounded-full ${course.published ? "bg-success" : "bg-warning"}`} />
            <span className="text-caption-uppercase uppercase text-ink">
              {capitalize(course.rank)} · {lessons.length}{" "}
              {lessons.length === 1 ? "lesson" : "lessons"}
              {!course.published && " · Draft"}
            </span>
          </div>
          <h1 className="font-display text-display-xl text-ink mb-6 leading-tight">
            {course.title}
          </h1>
          <p className="text-body-md text-surface-tint max-w-xl">
            {course.description}
          </p>
          {isCourseAuthor && !course.published && (
            <div className="mt-6 inline-flex items-start gap-3 bg-warning/10 text-ink rounded-2xl px-4 py-3 max-w-xl">
              <span className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
              <p className="text-body-sm text-surface-tint">
                This course is a <span className="font-semibold text-ink">draft</span>. Add modules and files below — students see it only after you publish.
              </p>
            </div>
          )}
          <div className="mt-8 flex gap-4">
            {isInstructor ? (
              <>
                {isCourseAuthor && (
                  <>
                    <Link href={`/courses/${courseId}/edit`}>
                      <Button className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Course
                      </Button>
                    </Link>
                    <DeleteCourseButton courseId={courseId} />
                  </>
                )}
              </>
            ) : (
              <Button className="gap-2">
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="bg-brand-lavender rounded-[32px] aspect-[4/3] overflow-hidden relative shadow-sm border border-ink/5 flex items-center justify-center">
            <div className="text-center p-8">
              <Badge variant="ghost" className="mb-4">
                {capitalize(course.rank)}
              </Badge>
              <h2 className="font-display text-display-sm text-ink">
                {course.title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons — client-only to avoid hydration mismatch from useQueries */}
      <Suspense fallback={<div className="h-40" />}>
        <LessonList
          courseId={courseId}
          lessons={lessons}
          isInstructor={isCourseAuthor}
          instructorId={course.instructor_id}
          published={course.published}
        />
      </Suspense>
    </div>
  );
}
