"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Sigma } from "lucide-react";

interface MathEquationProps {
  formula: string;
  className?: string;
}

export function MathEquation({ formula }: MathEquationProps) {
  const parsed = useMemo(() => {
    if (!formula || typeof formula !== "string") return null;

    let clean = formula.trim()
      .replace(/^```(latex|math|text)?\n?/, "")
      .replace(/```$/, "")
      .trim();

    // Check if there's a prefix label like "Circulation Theory: \(...\)"
    let label = "";
    const prefixMatch = clean.match(/^([A-Za-z0-9\s\-–—/()]+):(?:\s*)([\s\S]+)$/);
    if (prefixMatch && prefixMatch[1] && prefixMatch[2]) {
      // If the part before the colon is text and after the colon contains math symbols
      const candidateLabel = prefixMatch[1].trim();
      const candidateMath = prefixMatch[2].trim();
      if (!candidateLabel.includes("=") && !candidateLabel.includes("\\")) {
        label = candidateLabel;
        clean = candidateMath;
      }
    }

    // Strip LaTeX math delimiters: \( \), \[ \], $, $$, \\( \\)
    let mathStr = clean
      .replace(/^(?:\\{1,2}\(|\\{1,2}\[|\${1,2})\s*/, "")
      .replace(/\s*(?:\\{1,2}\)|\\{1,2}\]|\${1,2})$/, "")
      .trim();

    // Try rendering with KaTeX
    try {
      const html = katex.renderToString(mathStr, {
        displayMode: true,
        throwOnError: true, // throw so we catch errors instead of rendering red KaTeX error text
      });
      return { html, label, fallback: null };
    } catch {
      // If strict KaTeX fails, try replacing common plain math notation
      try {
        // e.g. replace * with \times, Gamma with \Gamma
        let sanitized = mathStr
          .replace(/\*/g, " \\times ")
          .replace(/\bGamma\b/g, "\\Gamma")
          .replace(/\brho\b/g, "\\rho")
          .replace(/\balpha\b/g, "\\alpha")
          .replace(/\bDelta\b/g, "\\Delta");
        const html = katex.renderToString(sanitized, {
          displayMode: true,
          throwOnError: true,
        });
        return { html, label, fallback: null };
      } catch {
        // Return clean fallback text without red error text
        return { html: null, label, fallback: mathStr };
      }
    }
  }, [formula]);

  if (!formula || !parsed) return null;

  return (
    <div className="my-5 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/50 via-slate-50/50 to-indigo-50/40 p-4 shadow-2xs">
      <div className="flex items-center gap-1.5 text-blue-800 text-[11px] font-semibold tracking-wider uppercase mb-1.5">
        <Sigma className="w-3.5 h-3.5 text-blue-600" />
        <span>Technical Formula & Governing Equation</span>
      </div>

      {parsed.label && (
        <span className="text-[13px] font-semibold text-gray-800 block mb-1">
          {parsed.label}
        </span>
      )}

      {parsed.html ? (
        <div
          className="text-gray-900 py-1.5 overflow-x-auto text-[16px] select-all [&_.katex-display]:my-1"
          dangerouslySetInnerHTML={{ __html: parsed.html }}
        />
      ) : (
        <div className="font-mono text-[14px] text-gray-900 bg-white/90 p-2.5 rounded-lg border border-gray-100 font-semibold text-center my-1">
          {parsed.fallback}
        </div>
      )}
    </div>
  );
}
