"use client";

import { useEffect, useState } from "react";
import { Download, Presentation, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { ReactPptxViewer, usePptxViewer } from "@extend-ai/react-pptx";

interface PptxViewerProps {
  filePath: string;
  fileName: string;
}

export function PptxViewer({ filePath, fileName }: PptxViewerProps) {
  const [content, setContent] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const viewer = usePptxViewer();
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setContent(null);

    (async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("File not found");
        const arrayBuffer = await response.arrayBuffer();
        if (!cancelled) {
          setContent(new Uint8Array(arrayBuffer));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load document");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filePath]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-[13px] font-medium">Loading presentation…</span>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 bg-gradient-to-b from-orange-50/40 to-white">
        <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Presentation className="w-10 h-10 text-orange-500" />
        </div>
        <div className="text-center">
          <h3 className="text-[16px] font-semibold text-gray-900 mb-1">{fileName}</h3>
          <p className="text-[13px] text-gray-500 max-w-xs mb-4">
            Failed to load presentation: {error}
          </p>
          <a
            href={filePath}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Presentation
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col animate-in fade-in duration-500 bg-gray-100 overflow-hidden">
      
      {/* Top Control Bar */}
      <div className="shrink-0 px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm relative">
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => viewer.controller?.previous()}
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
            title="Previous Slide"
          >
             <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-medium text-gray-600 px-2 select-none">
             Slide Nav
          </span>
          <button 
            type="button"
            onClick={() => viewer.controller?.next()}
            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
            title="Next Slide"
          >
             <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewer Area */}
      <div 
        ref={setScrollElement} 
        className="flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden flex justify-center bg-gray-200/50"
      >
        <div className="h-full w-full max-w-5xl p-6">
          <ReactPptxViewer
            ref={viewer.ref}
            source={content}
            mode="slide"
            virtualization={{
              enabled: true,
              scrollElement: scrollElement ?? undefined,
            }}
          />
        </div>
      </div>

      {/* Bottom download bar */}
      <div className="shrink-0 px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2.5">
          <Presentation className="w-4 h-4 text-orange-500" />
          <span className="text-[13px] font-medium text-gray-700 truncate">
            {fileName}
          </span>
        </div>
        <a
          href={filePath}
          download
          className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}
