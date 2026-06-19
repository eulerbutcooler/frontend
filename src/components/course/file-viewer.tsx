"use client";

import { useState } from "react";
import { useFileViewUrl } from "@/hooks/use-file-url";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, X, FileText, ExternalLink } from "lucide-react";
import { FILE_ICONS } from "./file-list";
import type { FileType } from "@/types/course";

interface FileViewerProps {
  fileId: string;
  fileName: string;
  fileType: FileType;
  onClose: () => void;
}

export function FileViewer({
  fileId,
  fileName,
  fileType,
  onClose,
}: FileViewerProps) {
  const { data, isLoading } = useFileViewUrl(fileId);
  const [iframeError, setIframeError] = useState(false);
  const Icon = FILE_ICONS[fileType] ?? FileText;

  /* Office Online viewer only works with publicly accessible URLs.
     For local dev (localhost/127.0.0.1), fall back to download. */
  const isLocalUrl =
    data?.url &&
    (data.url.includes("localhost") || data.url.includes("127.0.0.1"));

  const canPreviewPdf = fileType === "pdf" && data?.url && !iframeError;
  const canPreviewOffice =
    (fileType === "ppt" || fileType === "docx") &&
    data?.url &&
    !iframeError &&
    !isLocalUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-canvas rounded-[24px] border border-hairline shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center border border-hairline shrink-0">
              <Icon className="h-5 w-5 text-surface-tint" />
            </div>
            <div className="min-w-0">
              <h3 className="text-title-md font-semibold text-ink truncate">
                {fileName}
              </h3>
              <p className="text-caption text-surface-tint uppercase tracking-wider">
                {fileType} document
              </p>
            </div>
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
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-strong transition-colors border border-hairline"
            >
              <X className="h-4 w-4 text-ink" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <Skeleton className="w-full h-[60vh] rounded-xl" />
          ) : canPreviewPdf ? (
            <iframe
              src={data.url}
              className="w-full h-[65vh] rounded-xl border border-hairline"
              title={fileName}
              onError={() => setIframeError(true)}
            />
          ) : canPreviewOffice ? (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data!.url)}`}
              className="w-full h-[65vh] rounded-xl border border-hairline"
              title={fileName}
              onError={() => setIframeError(true)}
            />
          ) : (
            /* Fallback: download prompt */
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-surface-card flex items-center justify-center border border-hairline mb-6">
                <Icon className="h-10 w-10 text-outline" />
              </div>
              <h4 className="text-title-md font-semibold text-ink mb-2">
                {fileName}
              </h4>
              <p className="text-body-md text-surface-tint mb-6 max-w-md">
                {iframeError
                  ? "Unable to preview this file inline."
                  : isLocalUrl && (fileType === "ppt" || fileType === "docx")
                    ? "Office documents can only be previewed when hosted on a public URL. Download the file to view it locally."
                    : `Preview is not available for .${fileType} files.`}
              </p>
              {data?.url && (
                <div className="flex gap-3">
                  <a href={data.url} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Download File
                    </Button>
                  </a>
                  <a href={data.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open in New Tab
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
