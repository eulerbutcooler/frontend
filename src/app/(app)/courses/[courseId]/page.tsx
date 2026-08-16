import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowRight, Pencil, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LessonList } from "@/components/course/lesson-list";
import { DeleteCourseButton } from "@/components/course/delete-course-button";
import { Skeleton } from "@/components/ui/skeleton";
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
        className="focus-ring inline-flex items-center gap-2 text-button font-semibold text-surface-tint hover:text-ink transition-colors mb-8"
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
            <div className="mt-6 inline-flex items-start gap-3 bg-warning/15 rounded-2xl px-4 py-3 max-w-xl">
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
          <div className="relative rounded-[24px] aspect-[4/3] overflow-hidden shadow-sm border border-hairline">
            <Image
              src="/Indian-Mig-29K-2(1).jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-caption-uppercase uppercase text-white/80 tracking-widest">
                Training Material
              </p>
              <p className="font-display text-display-sm">
                {capitalize(course.rank)} Curriculum
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons — client-only to avoid hydration mismatch from useQueries */}
      <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
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
