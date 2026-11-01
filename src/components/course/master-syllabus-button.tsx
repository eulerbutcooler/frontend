"use client";

import { ChevronRight, FileText } from "lucide-react";

interface MasterSyllabusButtonProps {
  courseId: string;
}

export function MasterSyllabusButton({ courseId }: MasterSyllabusButtonProps) {
  return (
    <a
      href={`/api/syllabus/${courseId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900">
          Master Syllabus
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Original DOCX used to generate this subject
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
    </a>
  );
}
