"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import {
  FileText,
  FileSpreadsheet,
  BookOpen,
  Presentation,
  Video,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/icon-button";
import { IngestStatusBadge } from "./ingest-status-badge";
import { FileViewer } from "./file-viewer";
import { FileUploadZone } from "./file-upload-zone";
import type { FileAsset, FileType } from "@/types/course";

export const FILE_ICONS: Record<FileType, React.ElementType> = {
  pdf: FileText,
  ppt: FileSpreadsheet,
  pptx: FileSpreadsheet,
  docx: FileText,
  video: Video,
};

const CATEGORY_CONFIG: Record<
  string,
  {
    title: string;
    fileType: "pdf" | "ppt" | "video";
    icon: React.ElementType;
    accent: string;
    accentBg: string;
    description: string;
  }
> = {
  books: {
    title: "Reference Manuals & Books",
    fileType: "pdf",
    icon: BookOpen,
    accent: "text-blue-600",
    accentBg: "bg-blue-50 border-blue-100",
    description: "PDF flight manuals, SOPs, and technical handbooks",
  },
  presentations: {
    title: "Briefing Presentations",
    fileType: "ppt",
    icon: Presentation,
    accent: "text-amber-600",
    accentBg: "bg-amber-50 border-amber-100",
    description: "Slide decks and visual briefing modules",
  },
  videos: {
    title: "Video Clips",
    fileType: "video",
    icon: Video,
    accent: "text-purple-600",
    accentBg: "bg-purple-50 border-purple-100",
    description: "Subject reference videos and demonstrations",
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
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { data: files = [] } = useQuery({
    queryKey: ["files", lessonId],
    queryFn: () =>
      clientApi.get<FileAsset[]>(`/api/v1/lessons/${lessonId}/files`),
    // Keep polling while any file is still pending/processing so ingest
    // completions are reflected without a manual page refresh. Stop once every
    // file has reached a terminal state (ready/failed).
    refetchInterval: (query) => {
      const fs = query.state.data ?? [];
      const busy = fs.some(
        (f) => f.ingest_status === "pending" || f.ingest_status === "processing"
      );
      // Keep a slow idle poll so a file created by the async TUS completion
      // hook still appears even if the upload-time invalidation raced it.
      return busy ? 1500 : 10000;
    },
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const visibleFiles = isInstructor
    ? files
    : files.filter((f) => f.ingest_status === "ready");

  const handleDelete = async (file: FileAsset) => {
    const stillProcessing =
      file.ingest_status === "pending" || file.ingest_status === "processing";
    const message = stillProcessing
      ? `Delete "${file.file_name}"? It is still being processed; the ingest job may finish in the background. Its search index will be cleaned up.`
      : `Delete "${file.file_name}"? Its uploaded file and search index will also be removed.`;

    if (!window.confirm(message)) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(file.id));
    try {
      await clientApi.del(`/api/v1/files/${file.id}`);
      toast.success(`Deleted ${file.file_name}`);
      queryClient.invalidateQueries({ queryKey: ["files", lessonId] });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete the file"
      );
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
    }
  };

  const books = visibleFiles.filter((f) => f.file_type === "pdf");
  const presentations = visibleFiles.filter((f) => f.file_type === "ppt");
  const videos = visibleFiles.filter((f) => f.file_type === "video");

  const groupMap: Record<string, typeof visibleFiles> = {
    books,
    presentations,
    videos,
  };

  // Students: show nothing if no files at all
  if (!isInstructor && visibleFiles.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-[13px] text-gray-500">
          No study documents uploaded for this lesson yet.
        </p>
      </div>
    );
  }

  const renderFileRow = (file: FileAsset) => {
    const Icon = FILE_ICONS[file.file_type] ?? FileText;
    const isReady = file.ingest_status === "ready";

    // Visual badge styles for file extension
    const typeStyle =
      file.file_type === "pdf"
        ? "bg-rose-50 text-rose-600 border-rose-100"
        : file.file_type === "docx"
        ? "bg-blue-50 text-blue-600 border-blue-100"
        : file.file_type === "video"
        ? "bg-purple-50 text-purple-600 border-purple-100"
        : "bg-amber-50 text-amber-600 border-amber-100";

    return (
      <div
        key={file.id}
        className={`
          flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all group
          ${
            isReady
              ? "bg-white border-gray-200 hover:border-blue-400 hover:shadow-xs cursor-pointer"
              : "bg-gray-50/70 border-gray-200"
          }
        `}
        onClick={isReady ? () => setViewingFile(file) : undefined}
        onKeyDown={isReady ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setViewingFile(file);
          }
        } : undefined}
        role={isReady ? "button" : undefined}
        tabIndex={isReady ? 0 : undefined}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${typeStyle}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[13px] text-gray-900 font-medium truncate block group-hover:text-blue-600 transition-colors">
              {file.file_name}
            </span>
          </div>
          {file.ingest_status !== "ready" && (
            <IngestStatusBadge status={file.ingest_status} />
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {isReady && (
            <IconButton
              label={`View ${file.file_name}`}
              onClick={(e) => {
                e.stopPropagation();
                setViewingFile(file);
              }}
              className="h-7 px-2.5 rounded-lg text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Preview document"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View</span>
            </IconButton>
          )}

          {isInstructor && (
            <IconButton
              label={`Delete ${file.file_name}`}
              onClick={(e) => {
                e.stopPropagation();
                void handleDelete(file);
              }}
              disabled={deletingIds.has(file.id)}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Delete file and search index"
            >
              {deletingIds.has(file.id) ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </IconButton>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-5">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const groupFiles = groupMap[key] ?? [];
          const CategoryIcon = config.icon;

          // Students: skip empty categories
          if (!isInstructor && groupFiles.length === 0) return null;

          return (
            <div key={key}>
              {/* Category Header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className={`w-6 h-6 rounded-md border ${config.accentBg} flex items-center justify-center`}
                >
                  <CategoryIcon className={`h-3 w-3 ${config.accent}`} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-800 leading-none">
                    {config.title}
                  </h4>
                </div>
                {groupFiles.length > 0 && (
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                    {groupFiles.length}
                  </span>
                )}
              </div>

              {/* File Items */}
              {groupFiles.length > 0 && (
                <div className="space-y-1.5 mb-3">
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
