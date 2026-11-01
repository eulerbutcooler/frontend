import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import { LessonPlanButton } from "@/components/course/lesson-plan-button";
import type { Course, Lesson } from "@/types/course";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function LessonPlansPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "instructor") redirect(`/courses/${courseId}`);

  let course: Course;
  let lessons: Lesson[] = [];
  try {
    [course, lessons] = await Promise.all([
      api.get<Course>(`/api/v1/courses/${courseId}`),
      api.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`),
    ]);
    lessons = Array.isArray(lessons) ? lessons : [];
  } catch {
    notFound();
  }

  const ready = lessons.filter((lesson) => lesson.lesson_plan_status === "ready");
  const generating = lessons.filter(
    (lesson) =>
      lesson.lesson_plan_status === "generating" ||
      lesson.lesson_plan_status === "pending"
  );
  const failed = lessons.filter((lesson) => lesson.lesson_plan_status === "failed");

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-[20px] font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to subject
        </Link>
        <div className="text-[12px] text-gray-500">
          {course.title} · {ready.length} PDF{ready.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
                Generated Lesson Plans
              </h1>
              <p className="text-[13px] text-gray-500 mt-1 max-w-2xl">
                One formatted PDF per syllabus row. Open any plan to view or
                download it.
              </p>
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-[13px] text-gray-500">
              This subject has no lessons yet.
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl px-4 py-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-500 flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {lesson.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {lesson.lesson_plan_status === "ready"
                          ? "PDF ready"
                          : lesson.lesson_plan_status === "failed"
                            ? lesson.lesson_plan_error || "Generation failed"
                            : "Generating…"}
                      </p>
                    </div>
                  </div>

                  {lesson.lesson_plan_status === "ready" ? (
                    <LessonPlanButton lesson={lesson} />
                  ) : lesson.lesson_plan_status === "failed" ? (
                    <span className="text-[11px] font-medium text-red-600 shrink-0">
                      Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 shrink-0">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-gray-500">
            <span>{ready.length} ready</span>
            <span>{generating.length} generating</span>
            <span>{failed.length} failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
