"use client";

import { useState, useEffect } from "react";
import { DocxViewer } from "./docx-viewer";
import { PdfViewer } from "./pdf-viewer";
import { PptxViewer } from "./pptx-viewer";
import { Loader2 } from "lucide-react";
import { clientApi } from "@/lib/api-client.client";
import type { LessonFile } from "@/types/progress";

interface DocViewerProps {
  file: LessonFile;
}

export function DocViewer({ file }: DocViewerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    setError(null);

    clientApi
      .get<{ url: string }>(`/api/v1/files/${file.id}/view`)
      .then((res) => {
        if (!cancelled && res?.url) {
          const proxiedUrl = `/api/files/proxy?url=${encodeURIComponent(res.url)}`;
          setUrl(proxiedUrl);
        }
      })
      .catch((err) => {
        console.error("Failed to load file view URL:", err);
        if (!cancelled) {
          setError("Failed to generate secure preview link for this document.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file.id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 p-6 text-center">
        <p className="text-[14px] font-medium text-gray-700">{error}</p>
        <p className="text-[12px] text-gray-400">File: {file.file_name}</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-[13px] font-medium">Preparing document viewer…</span>
      </div>
    );
  }

  switch (file.file_type) {
    case "docx":
      return <DocxViewer filePath={url} />;
    case "pdf":
      return <PdfViewer filePath={url} />;
    case "ppt":
    case "pptx":
      return <PptxViewer filePath={url} fileName={file.file_name} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400 text-[14px]">
          Unsupported file type
        </div>
      );
  }
}
