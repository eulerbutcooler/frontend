"use client";

import { useState } from "react";
import { useFileViewUrl } from "@/hooks/use-file-url";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, X, FileText, FileSpreadsheet } from "lucide-react";
import type { FileType } from "@/types/course";

interface FileViewerProps {
  fileId: string;
  fileName: string;
  fileType: FileType;
  onClose: () => void;
}

const FILE_ICONS: Record<FileType, React.ElementType> = {
  pdf: FileText,
  ppt: FileSpreadsheet,
  docx: FileText,
};

export function FileViewer({
  fileId,
  fileName,
  fileType,
  onClose,
}: FileViewerProps) {
  const { data, isLoading } = useFileViewUrl(fileId);
  const [iframeError, setIframeError] = useState(false);
  const Icon = FILE_ICONS[fileType] ?? FileText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-canvas rounded-[24px] border border-hairline shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-surface-tint" />
            <h3 className="text-title-md font-semibold text-ink truncate">
              {fileName}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {data?.url && (
              <a href={data.url} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-strong transition-colors"
            >
              <X className="h-4 w-4 text-ink" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <Skeleton className="w-full h-[60vh] rounded-xl" />
          ) : fileType === "pdf" && data?.url && !iframeError ? (
            <iframe
              src={data.url}
              className="w-full h-[60vh] rounded-xl border border-hairline"
              title={fileName}
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <Icon className="h-16 w-16 text-outline mb-6" />
              <h4 className="text-title-md font-semibold text-ink mb-2">
                {fileName}
              </h4>
              <p className="text-body-md text-surface-tint mb-6">
                {fileType === "pdf" && iframeError
                  ? "Unable to preview this PDF inline."
                  : `Preview is not available for .${fileType} files.`}
              </p>
              {data?.url && (
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
