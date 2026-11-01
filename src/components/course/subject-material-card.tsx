"use client";

import { BookOpen } from "lucide-react";
import { FileList } from "./file-list";
import type { Lesson } from "@/types/course";

interface SubjectMaterialCardProps {
  lesson: Lesson;
  instructorId: string;
}

export function SubjectMaterialCard({
  lesson,
  instructorId,
}: SubjectMaterialCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gray-50/70">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              Subject Supporting Material
            </h2>
            <p className="text-[12px] text-gray-500 mt-1 max-w-2xl">
              Upload PDFs or PPTs for the whole subject here. These files are
              used by every lesson and topic when generating slides, question
              banks and quizzes.
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <FileList
          lessonId={lesson.id}
          isInstructor
          instructorId={instructorId}
        />
      </div>
    </div>
  );
}
