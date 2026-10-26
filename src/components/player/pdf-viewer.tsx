"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PdfViewerProps {
  filePath: string;
}

export function PdfViewer({ filePath }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);
  
  // Use the prebuilt PDF.js viewer from the public directory
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}`;

  return (
    <div className="h-full w-full flex flex-col animate-in fade-in duration-500 bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading PDF viewer...</p>
        </div>
      )}
      
      {viewerUrl && (
        <iframe
          src={viewerUrl}
          className="w-full h-full border-0 z-20"
          title="PDF Viewer"
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
}
