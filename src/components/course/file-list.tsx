"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import { FileText, FileSpreadsheet, Eye, Trash2 } from "lucide-react";
import { IngestStatusBadge } from "./ingest-status-badge";
import { FileViewer } from "./file-viewer";
import type { FileAsset, FileType } from "@/types/course";

const FILE_ICONS: Record<FileType, React.ElementType> = {
  pdf: FileText,
  ppt: FileSpreadsheet,
  docx: FileText,
};

interface FileListProps {
  lessonId: string;
  isInstructor: boolean;
}

export function FileList({ lessonId, isInstructor }: FileListProps) {
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

  if (visibleFiles.length === 0) return null;

  const handleDelete = async (fileId: string) => {
    try {
      await clientApi.del(`/api/v1/files/${fileId}`);
      queryClient.invalidateQueries({ queryKey: ["files", lessonId] });
    } catch {
      // Handle silently
    }
  };

  return (
    <>
      <div className="mt-4 space-y-2">
        {visibleFiles.map((file) => {
          const Icon = FILE_ICONS[file.file_type] ?? FileText;
          return (
            <div
              key={file.id}
              className="flex items-center justify-between px-4 py-3 bg-surface-soft rounded-xl border border-hairline hover:border-outline-variant transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="h-4 w-4 text-surface-tint shrink-0" />
                <span className="text-body-sm text-ink truncate">
                  {file.file_name}
                </span>
                <IngestStatusBadge
                  fileId={file.id}
                  initialStatus={file.ingest_status}
                />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {file.ingest_status === "ready" && (
                  <button
                    onClick={() => setViewingFile(file)}
                    className="w-7 h-7 flex items-center justify-center text-surface-tint hover:text-ink rounded-md hover:bg-surface-container transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                )}
                {isInstructor && (
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="w-7 h-7 flex items-center justify-center text-surface-tint hover:text-error rounded-md hover:bg-error/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
