"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { clientApi } from "@/lib/api-client.client";
import type { SyllabusImportResult } from "@/types/course";

export function MasterSyllabusImport() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rank, setRank] = useState("officer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SyllabusImportResult | null>(null);

  const resetImport = () => {
    setResult(null);
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a master-syllabus DOCX first.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const data = await clientApi.upload<SyllabusImportResult>(
        "/api/v1/syllabus/import",
        file,
        "syllabus",
        { rank }
      );
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      const created = data.subjects.filter((s) => s.status === "created").length;
      toast.success(
        `Imported ${created} subject${created === 1 ? "" : "s"}. Lesson plans are generating; add PDFs/PPTs, then generate content.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!result && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-gray-900">
                Import a master syllabus
              </h2>
              <p className="text-[13px] text-gray-500 mt-1 max-w-2xl">
                Upload one DOCX containing multiple subjects. The parser detects
                every detailed-syllabus table, creates a draft subject for each,
                and starts lesson-plan generation. Subjects with the same name
                are updated in place, so a revised document refreshes the old
                topics and lesson plans. After that, add PDFs/PPTs to the subject
                and generate slides, question banks and quizzes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-8 w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl p-10 text-center transition-colors cursor-pointer"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                setFile(selected);
                setError("");
              }}
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-gray-900">
              {file ? file.name : "Choose master-syllabus DOCX"}
            </p>
            <p className="text-[12px] text-gray-500 mt-1">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(1)} MB selected`
                : "One upload creates every subject found in the document"}
            </p>
          </button>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <label className="text-[12px] font-medium text-gray-700">
              Rank
              <select
                value={rank}
                onChange={(event) => setRank(event.target.value)}
                className="mt-1 block h-9 px-3 text-[13px] bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="officer">Officer</option>
                <option value="apprentice">Apprentice</option>
                <option value="cadet">Cadet</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !file}
              className="inline-flex items-center gap-2 h-9 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting
                ? "Creating subjects and lesson plans..."
                : "Import subjects & lesson plans"}
            </button>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2 text-[13px] text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </form>
      )}

      {result && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-bold text-gray-900">
                Import complete
              </h2>
              <p className="text-[13px] text-gray-500 mt-1">
                {result.subjects.length} subjects detected in{" "}
                <span className="font-medium text-gray-700">{result.file_name}</span>.
                Lesson plans are generating now. Add PDFs/PPTs to each subject,
                then use <span className="font-medium text-gray-700">Generate Content</span>{" "}
                in the subject builder for slides, question bank and quizzes.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={resetImport}
                className="inline-flex items-center h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[12px] font-semibold rounded-lg"
              >
                Import another
              </button>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg"
              >
                View subjects
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
            {result.subjects.map((subject) => {
              const created = subject.status === "created";
              const updated = subject.status === "updated";
              const existing = subject.status === "existing";
              return (
                <div
                  key={`${subject.subject_code}-${subject.course_id}`}
                  className="px-6 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {created || updated ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : existing ? (
                        <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {subject.subject_name}{" "}
                        <span className="text-gray-400 font-normal">
                          ({subject.subject_code})
                        </span>
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 ml-6">
                      {subject.lesson_count} lessons
                      {updated ? " · updated from the new syllabus" : ""}
                      {existing ? " · already existed, skipped" : ""}
                      {subject.error ? ` · ${subject.error}` : ""}
                    </p>
                  </div>
                  {subject.course_id && (
                    <div className="shrink-0 flex items-center gap-3">
                      <Link
                        href={`/courses/${subject.course_id}/edit`}
                        className="text-[12px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Add material
                      </Link>
                      <Link
                        href={`/courses/${subject.course_id}`}
                        className="text-[12px] font-medium text-gray-500 hover:text-gray-900"
                      >
                        Open subject
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
