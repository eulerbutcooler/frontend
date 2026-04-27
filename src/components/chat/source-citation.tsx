"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import type { Citation } from "@/types/chat";

interface SourceCitationProps {
  citations: Citation[];
}

export function SourceCitation({ citations }: SourceCitationProps) {
  const [expanded, setExpanded] = useState(false);

  if (citations.length === 0) return null;

  return (
    <div className="bg-brand-mint px-5 py-4 rounded-2xl text-ink text-[15px] leading-relaxed shadow-sm border border-[#8ec7b6]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 font-semibold text-sm w-full"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {citations.length} {citations.length === 1 ? "source" : "sources"} referenced
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {citations.map((citation, i) => (
            <div
              key={`${citation.file_id}-${i}`}
              className="flex items-center gap-2 text-sm text-ink/80"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{citation.file_name}</span>
              {citation.score != null && (
                <span className="text-[11px] text-outline ml-auto shrink-0">
                  {Math.round(citation.score * 100)}% match
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
