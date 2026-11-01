"use client";

import { FileText, Loader2 } from "lucide-react";
import type { Lesson } from "@/types/course";

interface LessonPlanButtonProps {
  lesson: Lesson;
  compact?: boolean;
}

export function LessonPlanButton({ lesson, compact }: LessonPlanButtonProps) {
  const status = lesson.lesson_plan_status;

  if (status === "generating" || status === "pending") {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-medium text-blue-600 ${
          compact ? "text-[10px]" : "text-[11px]"
        }`}
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {compact ? "Generating" : "Generating lesson plan"}
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-medium text-red-600 ${
          compact ? "text-[10px]" : "text-[11px]"
        }`}
        title={lesson.lesson_plan_error}
      >
        <FileText className="w-3.5 h-3.5" />
        {compact ? "Plan failed" : "Lesson plan failed"}
      </span>
    );
  }

  if (status !== "ready") return null;

  return (
    <a
      href={`/api/lesson-plans/${lesson.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors ${
        compact
          ? "h-7 px-2.5 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
          : "h-8 px-3 text-[12px] bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
      }`}
      title="Open generated lesson plan PDF"
    >
      <FileText className="w-3.5 h-3.5" />
      Lesson Plan PDF
    </a>
  );
}
