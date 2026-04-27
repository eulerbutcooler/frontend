import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowRight, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonList } from "@/components/course/lesson-list";
import type { Course, Lesson } from "@/types/course";

function formatRank(rank?: string | null): string {
  if (!rank) return "—";
  return rank.charAt(0).toUpperCase() + rank.slice(1);
}

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
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-caption-uppercase uppercase text-ink">
              {formatRank(course.rank)} · {lessons.length}{" "}
              {lessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>
          <h1 className="font-display text-display-xl text-ink mb-6 leading-tight">
            {course.title}
          </h1>
          <p className="text-body-md text-surface-tint max-w-xl">
            {course.description}
          </p>
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
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
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
                {formatRank(course.rank)}
              </Badge>
              <h2 className="font-display text-display-sm text-ink">
                {course.title}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <LessonList
        courseId={courseId}
        lessons={lessons}
        isInstructor={isCourseAuthor}
        instructorId={course.instructor_id}
      />
    </div>
  );
}
