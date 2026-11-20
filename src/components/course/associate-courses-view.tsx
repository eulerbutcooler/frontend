"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  useAssociateCourse,
  useDisassociateCourse,
  useInstructorCatalog,
} from "@/hooks/use-courses";
import { getCourseBranches, getSpecializationMeta } from "@/lib/course-utils";
import type { Course } from "@/types/course";

export function AssociateCoursesView() {
  const { data: courses = [], isLoading } = useInstructorCatalog();
  const associate = useAssociateCourse();
  const disassociate = useDisassociateCourse();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const toggle = async (course: Course) => {
    if (pendingId) return;
    setPendingId(course.id);
    try {
      if (course.associated) {
        await disassociate.mutateAsync(course.id);
      } else {
        await associate.mutateAsync(course.id);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update association."
      );
    } finally {
      setPendingId(null);
    }
  };

  const selected = courses.filter((course) => course.associated).length;

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-500" />
            Courses
          </Link>
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
              Associate subjects
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Tick the master catalogue subjects you want on your profile.
            </p>
          </div>
        </div>
        <span className="text-[12px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          {selected} associated
        </span>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-6 scrollbar-hide">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <BookOpen className="h-8 w-8 text-gray-300 mb-3" />
            <p className="text-[14px] font-semibold text-gray-900">
              No master subjects available
            </p>
            <p className="text-[13px] text-gray-500 mt-1">
              The master instructor has not published a catalogue yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {courses.map((course) => {
              const branches = getCourseBranches(course).map(
                (branch) => getSpecializationMeta(branch).badge
              );
              const isPending = pendingId === course.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  role="checkbox"
                  aria-checked={Boolean(course.associated)}
                  disabled={isPending}
                  onClick={() => toggle(course)}
                  className={`text-left rounded-xl border p-4 transition-colors disabled:opacity-60 ${
                    course.associated
                      ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${
                        course.associated
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : course.associated ? (
                        <Check className="size-3.5" />
                      ) : null}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                          {course.title}
                        </p>
                        <span
                          className={`shrink-0 text-[10px] font-bold uppercase tracking-wide rounded-full border px-2 py-0.5 ${
                            course.published
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                              : "text-amber-700 bg-amber-50 border-amber-200"
                          }`}
                        >
                          {course.published ? "Published" : "Draft"}
                        </span>
                      </div>

                      {course.description && (
                        <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {branches.map((badge) => (
                          <span
                            key={badge}
                            className="text-[10px] font-bold text-gray-600 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
