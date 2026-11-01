"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCourseSyllabus,
  useUploadCourseSyllabus,
} from "@/hooks/use-syllabus";

interface MasterSyllabusCardProps {
  courseId: string;
  courseTitle?: string;
}

export function MasterSyllabusCard({
  courseId,
  courseTitle,
}: MasterSyllabusCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialCode = courseTitle?.match(/\((\d+)\)/)?.[1] ?? "";
  const [subjectCode, setSubjectCode] = useState(initialCode);
  const { data: syllabus, isLoading } = useCourseSyllabus(courseId);
  const upload = useUploadCourseSyllabus();

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      toast.error("Master syllabus must be a .docx file.");
      return;
    }

    try {
      const result = await upload.mutateAsync({
        courseId,
        file,
        subjectCode: subjectCode.trim(),
      });
      if (result.status === "failed") {
        toast.error(result.error || "Topic extraction failed.");
      } else {
        toast.success(
          `Syllabus parsed: ${result.topics.length} topics extracted.`
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Syllabus upload failed."
      );
    }
  };

  const isBusy = upload.isPending || syllabus?.status === "processing";

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Master Syllabus
          </h3>
          <p className="text-[12px] text-gray-500 mt-1 max-w-2xl">
            Upload the master syllabus DOCX. We read only the curriculum
            section, extract the lesson-plan topics, and use them to generate
            slides and Q&amp;A.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <label
              htmlFor="syllabus-subject-code"
              className="text-[11px] font-medium text-gray-600"
            >
              Subject code
            </label>
            <input
              id="syllabus-subject-code"
              value={subjectCode}
              onChange={(event) => setSubjectCode(event.target.value)}
              placeholder="e.g. 20"
              className="h-7 w-20 px-2 text-[12px] border border-gray-200 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[11px] text-gray-400">
              Used to pick the subject table from a multi-subject syllabus.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isBusy}
          className="flex items-center gap-1.5 h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[12px] font-medium rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          {isBusy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {syllabus ? "Replace" : "Upload DOCX"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-[12px] text-gray-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Checking syllabus...
        </div>
      )}

      {!isLoading && !syllabus && (
        <div className="mt-4 text-[12px] text-gray-500 border border-dashed border-gray-200 rounded-lg p-3">
          No master syllabus uploaded yet. Existing DOCX lesson plans will
          still work as a fallback.
        </div>
      )}

      {syllabus && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-[12px]">
            {syllabus.status === "ready" ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready
              </span>
            ) : syllabus.status === "failed" ? (
              <span className="flex items-center gap-1.5 text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Extraction failed
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Extracting topics...
              </span>
            )}
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 truncate">
              {syllabus.file_name}
            </span>
            {syllabus.status === "ready" && (
              <>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  {syllabus.topics.length} topics
                </span>
              </>
            )}
          </div>

          {syllabus.status === "failed" && syllabus.error && (
            <div className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {syllabus.error}
            </div>
          )}

          {syllabus.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {syllabus.topics.slice(0, 16).map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {topic}
                </span>
              ))}
              {syllabus.topics.length > 16 && (
                <span className="text-[11px] px-2.5 py-1 text-gray-500">
                  +{syllabus.topics.length - 16} more
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
