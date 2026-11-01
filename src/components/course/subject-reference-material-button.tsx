"use client";

import { useState } from "react";
import { ChevronRight, Loader2, Upload, X } from "lucide-react";
import { FileList } from "./file-list";
import { useMaterialsLesson } from "@/hooks/use-courses";

interface SubjectReferenceMaterialButtonProps {
  courseId: string;
  instructorId: string;
}

export function SubjectReferenceMaterialButton({
  courseId,
  instructorId,
}: SubjectReferenceMaterialButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: materialsLesson, isLoading } = useMaterialsLesson(courseId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!materialsLesson}
        className="w-full flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors text-left disabled:opacity-60"
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900">
            Reference Books, PPTs & Videos
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Upload subject-level study material
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {open && materialsLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[16px] font-bold text-gray-900">
                  Subject Reference Material
                </h2>
                <p className="text-[12px] text-gray-500 mt-1">
                  PDFs, PPTs and video clips uploaded here are available to
                  every lesson and topic in this subject.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FileList
                lessonId={materialsLesson.id}
                isInstructor
                instructorId={instructorId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
