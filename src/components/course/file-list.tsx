"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import {
  FileText,
  FileSpreadsheet,
  BookOpen,
  Presentation,
  ClipboardList,
  Eye,
  Trash2,
} from "lucide-react";
import { IngestStatusBadge } from "./ingest-status-badge";
import { FileViewer } from "./file-viewer";
import { FileUploadZone } from "./file-upload-zone";
import type { FileAsset, FileType } from "@/types/course";

const FILE_ICONS: Record<FileType, React.ElementType> = {
  pdf: FileText,
  ppt: FileSpreadsheet,
  docx: FileText,
};

const CATEGORY_CONFIG: Record<
  string,
  {
    title: string;
    fileType: "pdf" | "ppt" | "docx";
    icon: React.ElementType;
    accent: string;
    accentBg: string;
    description: string;
  }
> = {
  books: {
    title: "Books",
    fileType: "pdf",
    icon: BookOpen,
    accent: "text-blue-600",
    accentBg: "bg-blue-50",
    description: "PDF textbooks and reading materials",
  },
  presentations: {
    title: "Presentations",
    fileType: "ppt",
    icon: Presentation,
    accent: "text-amber-600",
    accentBg: "bg-amber-50",
    description: "PPT/PPTX slide decks",
  },
  plans: {
    title: "Plans",
    fileType: "docx",
    icon: ClipboardList,
    accent: "text-emerald-600",
    accentBg: "bg-emerald-50",
    description: "DOCX lesson plans and notes",
  },
};

interface FileListProps {
  lessonId: string;
  isInstructor: boolean;
  instructorId?: string;
}

export function FileList({
  lessonId,
  isInstructor,
  instructorId,
}: FileListProps) {
  const queryClient = useQueryClient();
  const [viewingFile, setViewingFile] = useState<FileAsset | null>(null);

  const { data: files = [] } = useQuery({
    queryKey: ["files", lessonId],
    queryFn: () =>
      clientApi.get<FileAsset[]>(`/api/v1/lessons/${lessonId}/files`),
  });

  const visibleFiles = isInstructor
    ? files
    : files.filter((f) => f.ingest_status === "ready");

  const handleDelete = async (fileId: string) => {
    try {
      await clientApi.del(`/api/v1/files/${fileId}`);
      queryClient.invalidateQueries({ queryKey: ["files", lessonId] });
    } catch {
      // Handle silently
    }
  };

  const books = visibleFiles.filter((f) => f.file_type === "pdf");
  const presentations = visibleFiles.filter((f) => f.file_type === "ppt");
  const plans = visibleFiles.filter((f) => f.file_type === "docx");

  const groupMap: Record<string, typeof visibleFiles> = {
    books,
    presentations,
    plans,
  };

  // Students: show nothing if no files at all
  if (!isInstructor && visibleFiles.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-body-md text-surface-tint">
          No materials available yet for this lesson.
        </p>
      </div>
    );
  }

  const renderFileRow = (file: FileAsset) => {
    const Icon = FILE_ICONS[file.file_type] ?? FileText;
    const isReady = file.ingest_status === "ready";
    return (
      <div
        key={file.id}
        className={`
          flex items-center justify-between px-4 py-3 rounded-xl border transition-all group
          ${
            isReady
              ? "bg-white border-hairline hover:border-outline-variant hover:shadow-sm cursor-pointer"
              : "bg-surface-soft border-hairline"
          }
        `}
        onClick={isReady ? () => setViewingFile(file) : undefined}
        role={isReady ? "button" : undefined}
        tabIndex={isReady ? 0 : undefined}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center shrink-0 border border-hairline">
            <Icon className="h-4 w-4 text-surface-tint" />
          </div>
          <div className="min-w-0">
            <span className="text-body-sm text-ink font-medium truncate block">
              {file.file_name}
            </span>
          </div>
          {file.ingest_status !== "ready" && (
            <IngestStatusBadge
              fileId={file.id}
              initialStatus={file.ingest_status}
            />
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isReady && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewingFile(file);
              }}
              className="w-7 h-7 flex items-center justify-center text-surface-tint hover:text-ink rounded-md hover:bg-surface-container transition-colors"
              title="View file"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
          {isInstructor && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(file.id);
              }}
              className="w-7 h-7 flex items-center justify-center text-surface-tint hover:text-error rounded-md hover:bg-error/10 transition-colors"
              title="Delete file"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const groupFiles = groupMap[key] ?? [];
          const CategoryIcon = config.icon;

          // Students: skip empty categories
          if (!isInstructor && groupFiles.length === 0) return null;

          return (
            <div key={key}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-7 h-7 rounded-lg ${config.accentBg} flex items-center justify-center`}
                >
                  <CategoryIcon className={`h-3.5 w-3.5 ${config.accent}`} />
                </div>
                <div>
                  <h4 className="text-body-sm font-semibold text-ink leading-none">
                    {config.title}
                  </h4>
                  {isInstructor && groupFiles.length === 0 && (
                    <p className="text-caption text-outline mt-0.5">
                      {config.description}
                    </p>
                  )}
                </div>
                {groupFiles.length > 0 && (
                  <span className="text-caption text-surface-tint bg-surface-card px-2 py-0.5 rounded-full border border-hairline">
                    {groupFiles.length}
                  </span>
                )}
              </div>

              {/* File Items */}
              {groupFiles.length > 0 && (
                <div className="space-y-2 mb-3">
                  {groupFiles.map(renderFileRow)}
                </div>
              )}

              {/* Upload Zone (instructor only) */}
              {isInstructor && instructorId && (
                <FileUploadZone
                  lessonId={lessonId}
                  instructorId={instructorId}
                  allowedFileType={config.fileType}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <FileViewer
          fileId={viewingFile.id}
          fileName={viewingFile.file_name}
          fileType={viewingFile.file_type}
          onClose={() => setViewingFile(null)}
        />
      )}
    </>
  );
}
