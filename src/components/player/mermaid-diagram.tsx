"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

/**
 * Preprocess and sanitize Mermaid diagram syntax.
 * LLMs frequently generate node labels with unquoted parentheses, colons, or math notation
 * (e.g., A[New Angle of Attack (α)] or A -->|Test (parens)| B), which causes Mermaid parser errors.
 * This sanitizer wraps unquoted labels in double quotes and ensures proper headers.
 */
function sanitizeMermaidCode(raw: string): string {
  let clean = raw
    .trim()
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/```$/, "")
    .trim();

  // If missing diagram type, default to graph TD
  if (
    !/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline)\b/im.test(
      clean
    )
  ) {
    clean = "graph TD\n" + clean;
  }

  const lines = clean.split("\n");
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (
      !trimmed ||
      /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline|subgraph|end|style|classDef|click)\b/i.test(
        trimmed
      )
    ) {
      return line;
    }

    // Step 1: Temporarily stash existing string literals
    const stringLiterals: string[] = [];
    let l = line.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => {
      const placeholder = `___STR_${stringLiterals.length}___`;
      stringLiterals.push(match);
      return placeholder;
    });

    const isPlaceholder = (s: string) => /^___STR_\d+___$/.test(s.trim());

    // Step 2: Fix pipe labels on links: |text| -> |"text"| if contains symbols
    l = l.replace(/\|([^"\|\r\n]+)\|/g, (match, inner) => {
      if (isPlaceholder(inner)) return match;
      if (/[()[\]{}\\:]/.test(inner)) {
        return `|"${inner.replace(/"/g, "'").trim()}"|`;
      }
      return match;
    });

    // Step 3: Stadium shapes: ID([label]) -> ID(["label"])
    l = l.replace(/(\b[\w-]+)\s*\(\[\s*([^\r\n]+?)\s*\]\)/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      return `${id}(["${text.replace(/"/g, "'").trim()}"])`;
    });

    // Step 4: Cylinder shapes: ID[(label)] -> ID[("label")]
    l = l.replace(/(\b[\w-]+)\s*\[\(\s*([^\r\n]+?)\s*\)\]/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      return `${id}[("${text.replace(/"/g, "'").trim()}")]`;
    });

    // Step 5: Subroutine shapes: ID[[label]] -> ID[["label"]]
    l = l.replace(/(\b[\w-]+)\s*\[\[\s*([^\r\n]+?)\s*\]\]/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      return `${id}[["${text.replace(/"/g, "'").trim()}"]]`;
    });

    // Step 6: Circle shapes: ID((label)) -> ID(("label"))
    l = l.replace(/(\b[\w-]+)\s*\(\(\s*([^\r\n]+?)\s*\)\)/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      return `${id}(("${text.replace(/"/g, "'").trim()}"))`;
    });

    // Step 7: Hexagon shapes: ID{{label}} -> ID{{"label"}}
    l = l.replace(/(\b[\w-]+)\s*\{\{\s*([^\r\n]+?)\s*\}\}/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      return `${id}{{"${text.replace(/"/g, "'").trim()}"}}`;
    });

    // Step 8: Rhombus / Decision shapes: ID{label} -> ID{"label"}
    l = l.replace(/(\b[\w-]+)\s*\{\s*([^{}\r\n]+?)\s*\}/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      if (/[()[\]\\:]/.test(text)) {
        return `${id}{"${text.replace(/"/g, "'").trim()}"}`;
      }
      return match;
    });

    // Step 9: Standard rectangular brackets: ID[label] (single brackets only)
    l = l.replace(/(\b[\w-]+)\s*\[(?![\[\(])\s*([^\[\]\r\n]+?)\s*\](?![\]\)])/g, (match, id, text) => {
      if (isPlaceholder(text)) return match;
      return `${id}["${text.replace(/"/g, "'").trim()}"]`;
    });

    // Step 10: Restore string literals
    l = l.replace(/___STR_(\d+)___/g, (_, idx) => stringLiterals[Number(idx)]);

    return l;
  });

  return processedLines.join("\n");
}

function cleanupMermaidDom(diagramId: string) {
  if (typeof document === "undefined") return;
  // Remove temporary elements or stray error banners Mermaid injected into body
  const targets = [diagramId, `d${diagramId}`, "dmermaid"];
  targets.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  document.querySelectorAll(`[id^='dmermaid'], [id^='d${diagramId}']`).forEach((el) => {
    el.remove();
  });
}

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9_]/g, "_");
  const diagramId = `mermaid_${rawId}`;
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "inherit",
      suppressErrorRendering: true,
    });

    const cleanCode = sanitizeMermaidCode(code);

    if (!cleanCode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    mermaid
      .render(diagramId, cleanCode)
      .then(({ svg }) => {
        if (!cancelled) {
          setSvgHtml(svg);
          setLoading(false);
        }
      })
      .catch((err) => {
        cleanupMermaidDom(diagramId);
        if (!cancelled) {
          console.warn("Mermaid render error:", err);
          setError(cleanCode);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      cleanupMermaidDom(diagramId);
    };
  }, [code, diagramId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50/50 rounded-xl border border-gray-100 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-[13px]">Rendering flight schematic…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50/70 rounded-xl border border-dashed border-gray-200 text-left overflow-x-auto">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
          System Schematic Flow
        </span>
        <pre className="text-[12px] font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
          {error}
        </pre>
      </div>
    );
  }

  if (!svgHtml) return null;

  return (
    <div
      ref={containerRef}
      className={`mermaid-container flex justify-center items-center p-4 bg-white/80 rounded-xl border border-gray-100 overflow-x-auto shadow-sm ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
