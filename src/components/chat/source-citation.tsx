"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import type { Citation } from "@/types/chat";

interface SourceCitationProps {
  citations: Citation[];
  /**
   * Compact mode (default): inline pill button that expands to a constrained
   * width dropdown. Set false to render the legacy full-width block.
   */
  compact?: boolean;
}

/** Truncate a file name to a max character length with an ellipsis. */
function truncateName(name: string, max = 100): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + "…";
}

export function SourceCitation({ citations, compact = true }: SourceCitationProps) {
  const [expanded, setExpanded] = useState(false);

  if (citations.length === 0) return null;

  if (compact) {
    return (
      <div className="inline-flex flex-col items-start max-w-full">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-outline hover:text-ink transition-colors py-0.5 focus-ring rounded-md"
          title="View referenced sources"
        >
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[160px]">
            {citations.length} {citations.length === 1 ? "source" : "sources"}
          </span>
          <ChevronDown
            className={`h-3 w-3 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        {expanded && (
          <div className="mt-1.5 max-w-[280px] bg-white border border-hairline rounded-lg shadow-md p-2.5 space-y-1.5 animate-fade-in">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-outline px-1">
              Referenced sources
            </p>
            {citations.map((citation, i) => (
              <div
                key={`${citation.file_id}-${i}`}
                className="flex items-center gap-2 text-xs text-ink/80 px-1 py-0.5 rounded-md hover:bg-surface-soft"
                title={citation.file_name}
              >
                <FileText className="h-3 w-3 shrink-0 text-surface-tint" />
                <span className="truncate flex-1">{truncateName(citation.file_name)}</span>
                {citation.score != null && (
                  <span className="text-[10px] text-outline shrink-0">
                    {Math.round(citation.score * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Legacy full-width expandable block (opt-in via compact={false}).
  return (
    <div className="bg-brand-mint px-5 py-4 rounded-2xl text-ink text-[15px] leading-relaxed shadow-sm border border-ink/10">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="focus-ring flex items-center gap-2 font-semibold text-sm w-full"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`}
        />
        {citations.length} {citations.length === 1 ? "source" : "sources"} referenced
      </button>
      {expanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {citations.map((citation, i) => (
            <div
              key={`${citation.file_id}-${i}`}
              className="flex items-center gap-2 text-sm text-ink/80"
              title={citation.file_name}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{truncateName(citation.file_name)}</span>
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