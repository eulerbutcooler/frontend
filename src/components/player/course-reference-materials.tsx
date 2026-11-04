"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  FileText,
  Presentation,
  Video,
  X,
} from "lucide-react";
import { DocViewer } from "./doc-viewer";
import type { FileAsset } from "@/types/course";

type MaterialCategory = "books" | "presentations" | "videos";

interface CourseReferenceMaterialsProps {
  courseId: string;
  files: FileAsset[];
  hasSyllabus?: boolean;
  isInstructor?: boolean;
}

const CATEGORY_META: Record<
  MaterialCategory,
  { title: string; subtitle: string; icon: typeof BookOpen }
> = {
  books: {
    title: "View Reference Books",
    subtitle: "PDF manuals and handbooks",
    icon: BookOpen,
  },
  presentations: {
    title: "View PPT",
    subtitle: "Briefing presentations",
    icon: Presentation,
  },
  videos: {
    title: "Refer to Videos",
    subtitle: "Subject video references",
    icon: Video,
  },
};

export function CourseReferenceMaterials({
  courseId,
  files,
  hasSyllabus = false,
  isInstructor = false,
}: CourseReferenceMaterialsProps) {
  const [activeCategory, setActiveCategory] = useState<MaterialCategory | null>(
    null
  );
  const [viewingFile, setViewingFile] = useState<FileAsset | null>(null);

  const visibleFiles = isInstructor
    ? files
    : files.filter((file) => file.ingest_status === "ready");

  const byCategory: Record<MaterialCategory, FileAsset[]> = {
    books: visibleFiles.filter((file) => file.file_type === "pdf"),
    presentations: visibleFiles.filter(
      (file) => file.file_type === "ppt" || file.file_type === "pptx"
    ),
    videos: visibleFiles.filter((file) => file.file_type === "video"),
  };

  const categoryFiles = activeCategory ? byCategory[activeCategory] : [];
  const activeMeta = activeCategory ? CATEGORY_META[activeCategory] : null;

  return (
    <>
      <div className="shrink-0 border-b border-gray-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between px-0.5">
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-gray-700">
              Subject Reference Material
            </h3>
            <p className="text-[11px] text-gray-500">
              Scoped to this subject: books, presentations, syllabus and videos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(Object.keys(CATEGORY_META) as MaterialCategory[]).map((category) => {
            const meta = CATEGORY_META[category];
            const count = byCategory[category].length;
            const Icon = meta.icon;
            return (
              <button
                key={category}
                type="button"
                disabled={count === 0}
                onClick={() => setActiveCategory(category)}
                className="group flex min-h-[74px] items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-gray-900">
                    {meta.title}
                  </span>
                  <span className="block truncate text-[10px] text-gray-500">
                    {count > 0 ? `${count} file${count === 1 ? "" : "s"}` : meta.subtitle}
                  </span>
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-blue-500" />
              </button>
            );
          })}

          <a
            href={hasSyllabus ? `/api/syllabus/${courseId}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!hasSyllabus}
            className="group flex min-h-[74px] items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-semibold text-gray-900">
                View Syllabus
              </span>
              <span className="block truncate text-[10px] text-gray-500">
                {hasSyllabus ? "Open the syllabus DOCX" : "Not uploaded"}
              </span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-blue-500" />
          </a>
        </div>
      </div>

      {activeCategory && activeMeta && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActiveCategory(null)}
          />
          <div
            className="relative flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={activeMeta.title}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-[15px] font-bold text-gray-900">
                  {activeMeta.title}
                </h2>
                <p className="text-[11px] text-gray-500">
                  {categoryFiles.length} file
                  {categoryFiles.length === 1 ? "" : "s"} for this subject
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-3">
              {categoryFiles.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => {
                    setViewingFile(file);
                    setActiveCategory(null);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-gray-200 hover:bg-gray-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-medium text-gray-900">
                      {file.file_name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wide text-gray-400">
                      {file.file_type}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setViewingFile(null)}
          />
          <div className="relative flex h-[82vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-bold text-gray-900">
                  {viewingFile.file_name}
                </h2>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {viewingFile.file_type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingFile(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <DocViewer key={viewingFile.id} file={viewingFile} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
