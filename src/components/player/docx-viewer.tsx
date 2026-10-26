"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface DocxViewerProps {
  filePath: string;
}

export function DocxViewer({ filePath }: DocxViewerProps) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setHtml("");

    (async () => {
      try {
        const mammoth = (await import("mammoth")).default;
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("File not found");
        const arrayBuffer = await response.arrayBuffer();
        const options = {
          convertImage: mammoth.images.imgElement((image: any) => {
            return image.read("base64").then((imageBuffer: any) => {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer,
              };
            });
          }),
        };
        const result = await mammoth.convertToHtml({ arrayBuffer }, options);
        if (!cancelled) {
          setHtml(result.value);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load document",
          );
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
        <span className="text-[13px] font-medium">Loading document…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
        <p className="text-[14px] font-medium text-gray-900">
          Failed to load document
        </p>
        <p className="text-[13px]">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div
        className="max-w-3xl mx-auto p-8 animate-in fade-in duration-500
          [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:first:mt-0
          [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-6
          [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-2 [&_h3]:mt-4
          [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:text-[14px] [&_ul]:text-gray-700
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:text-[14px] [&_ol]:text-gray-700
          [&_li]:mb-1.5 [&_li]:leading-relaxed
          [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_table]:text-[13px]
          [&_th]:bg-gray-50 [&_th]:border [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
          [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2
          [&_strong]:font-semibold [&_strong]:text-gray-900
          [&_em]:italic
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4
          [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
