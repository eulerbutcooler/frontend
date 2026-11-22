"use client";

import { DocxViewer } from "./docx-viewer";
import { PdfViewer } from "./pdf-viewer";
import { PptxViewer } from "./pptx-viewer";
import type { LessonFile } from "@/types/progress";

interface DocViewerProps {
  file: LessonFile;
}

export function DocViewer({ file }: DocViewerProps) {
  // Same-origin, stable URL. The app server resolves it to a fresh presigned
  // SeaweedFS URL, so the browser never sees the storage host or signature.
  const url = `/api/files/${file.id}/content`;

  switch (file.file_type) {
    case "docx":
      return <DocxViewer filePath={url} />;
    case "pdf":
      return <PdfViewer filePath={url} />;
    case "ppt":
    case "pptx":
      return <PptxViewer filePath={url} fileName={file.file_name} />;
    case "video":
      return (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <video
            src={url}
            controls
            className="max-w-full max-h-full"
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400 text-[14px]">
          Unsupported file type
        </div>
      );
  }
}
