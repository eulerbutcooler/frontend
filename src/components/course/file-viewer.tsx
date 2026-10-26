"use client";

import { useState } from "react";
import { useFileViewUrl } from "@/hooks/use-file-url";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, X, FileText, ExternalLink, Sparkles } from "lucide-react";
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
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                {fileName}
              </h3>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                {fileType} document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.url && (
              <>
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-[12px] h-8">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in New Tab
                  </Button>
                </a>
                <a href={data.url} download={fileName} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-[12px] h-8">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
          {isLoading ? (
            <Skeleton className="w-full h-[65vh] rounded-xl bg-gray-200" />
          ) : canPreviewPdf ? (
            <div className="w-full h-[68vh] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs">
              <iframe
                src={data.url}
                className="w-full h-full"
                title={fileName}
                onError={() => setIframeError(true)}
              />
            </div>
          ) : canPreviewOffice ? (
            <div className="w-full h-[68vh] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs">
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data!.url)}`}
                className="w-full h-full"
                title={fileName}
                onError={() => setIframeError(true)}
              />
            </div>
          ) : (
            /* Fallback: Document Details & Instant Access */
            <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-[17px] font-semibold text-gray-900 mb-1.5">
                {fileName}
              </h4>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                {iframeError
                  ? "Inline browser preview unavailable for this file format. You can open it in a new window or download it directly."
                  : isLocalUrl && (fileType === "ppt" || fileType === "docx")
                    ? "This document has been ingested into AeroMentor's AI Flight Briefing engine. You can download the original copy or inspect its AI synthesized slides."
                    : `Direct preview is not available for .${fileType} files.`}
              </p>
              {data?.url && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href={data.url} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
                      <ExternalLink className="h-4 w-4" />
                      Open File
                    </Button>
                  </a>
                  <a href={data.url} download={fileName} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Copy
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
