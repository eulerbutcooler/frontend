import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { FigureImage } from "@/components/course/figure-image";
import type { Citation } from "@/types/chat";

interface MarkdownRendererProps {
  content: string;
  /** Figure citations that can be shown in place of "Figure:" captions. */
  figures?: Citation[];
}

const FIGURE_STOP_WORDS = new Set([
  "about", "above", "after", "again", "against", "along", "also", "among",
  "and", "another", "are", "because", "been", "before", "being", "below",
  "between", "both", "cannot", "could", "depicts", "diagram", "displays",
  "does", "down", "during", "each", "figure", "from", "further", "have",
  "having", "here", "illustrates", "image", "into", "its", "itself", "just",
  "more", "most", "other", "over", "same", "shows", "some", "such", "than",
  "that", "their", "them", "then", "there", "these", "they", "this", "those",
  "through", "under", "until", "very", "was", "were", "what", "when", "where",
  "which", "while", "will", "with", "would", "your",
]);

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textOf).join(" ");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

function significantWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !FIGURE_STOP_WORDS.has(word))
  );
}

function matchFigure(
  text: string,
  figures: Citation[] | undefined
): Citation | undefined {
  if (!figures?.length || !/\b(figure|diagram|illustration|image)\b/i.test(text)) {
    return undefined;
  }

  const words = significantWords(text);
  if (words.size < 2) return undefined;

  let best: Citation | undefined;
  let bestScore = 0;

  for (const figure of figures) {
    if (!figure.url || (!figure.kind && !figure.figure_id)) continue;
    const captionWords = significantWords(figure.caption ?? "");
    if (captionWords.size < 2) continue;

    let shared = 0;
    for (const word of words) {
      if (captionWords.has(word)) shared += 1;
    }
    const score = shared / Math.min(words.size, captionWords.size);
    if (score > bestScore) {
      bestScore = score;
      best = figure;
    }
  }

  return bestScore >= 0.4 ? best : undefined;
}

export function MarkdownRenderer({ content, figures }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate max-w-none text-[15px] leading-relaxed break-words text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-gray-800">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 first:mt-0 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-gray-900 mt-3.5 mb-2 first:mt-0 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold text-gray-900 mt-2.5 mb-1.5 first:mt-0">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2.5 space-y-1 text-gray-800">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-gray-800">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
          blockquote: ({ children }) => {
            const caption = textOf(children).trim();
            const figure = matchFigure(caption, figures);
            if (figure?.url) {
              return (
                <FigureImage
                  figure={{
                    url: figure.url,
                    caption: caption.replace(/^\s*figure:\s*/i, ""),
                  }}
                  className="my-3"
                />
              );
            }
            return (
              <blockquote className="border-l-3 border-blue-500 pl-3.5 py-1 my-2.5 text-gray-700 bg-blue-50/50 rounded-r-md text-[14px]">
                {children}
              </blockquote>
            );
          },
          code({ inline, className, children, ...props }: any) {
            if (inline) {
              return (
                <code
                  className="bg-gray-100 text-blue-700 font-mono text-[13px] px-1.5 py-0.5 rounded border border-gray-200 font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-900 text-gray-100 p-3.5 rounded-xl overflow-x-auto text-[13px] font-mono my-3 border border-gray-800 leading-normal">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50/70 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-gray-700 text-[13.5px]">{children}</td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          hr: () => <hr className="my-3.5 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
