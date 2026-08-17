"use client";

import { useState, type ReactNode } from "react";

/**
 * Lightweight Markdown renderer for chat messages.
 *
 * Supports the common LLM-output subset without external dependencies:
 * fenced code blocks (```), inline code, bold, italic, links, headings,
 * unordered/ordered lists, blockquotes, and paragraphs. Output is built as
 * React elements (no dangerouslySetInnerHTML) so content stays XSS-safe.
 */

interface MarkdownProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownProps) {
  const blocks = parseBlocks(content);
  return (
    <div className="min-w-0 max-w-full space-y-3 [overflow-wrap:anywhere]">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

/* ─── Block parsing ──────────────────────────────────────────────────────── */

type Block =
  | { type: "code"; lang: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "para"; text: string }
  | { type: "blank" };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    const fence = line.match(/^```\s*([\w-]+)?\s*$/);
    if (fence) {
      const lang = fence[1] ?? "";
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // consume closing fence (if present)
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quote.join("\n") });
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph (gather consecutive non-blank, non-special lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^```\s*[\w-]*\s*$/.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "para", text: para.join("\n") });
  }

  return blocks;
}

/* ─── Block rendering ────────────────────────────────────────────────────── */

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "code":
      return <CodeBlock key={key} lang={block.lang} code={block.code} />;
    case "heading":
      return (
        <div key={key} className={headingClass(block.level)}>
          {renderInline(block.text)}
        </div>
      );
    case "quote":
      return (
        <blockquote
          key={key}
          className="border-l-2 border-outline-variant pl-3 italic text-surface-tint"
        >
          {renderInline(block.text)}
        </blockquote>
      );
    case "ul":
      return (
        <ul key={key} className="list-disc pl-5 space-y-1">
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="list-decimal pl-5 space-y-1">
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ol>
      );
    case "para":
      return (
        <p key={key} className="whitespace-pre-wrap">
          {renderInline(block.text)}
        </p>
      );
    case "blank":
      return null;
  }
}

function headingClass(level: number): string {
  switch (level) {
    case 1:
      return "text-xl font-semibold font-display tracking-tight";
    case 2:
      return "text-lg font-semibold font-display tracking-tight";
    case 3:
      return "text-base font-semibold font-display";
    default:
      return "text-sm font-semibold font-display";
  }
}

/* ─── Inline parsing (code, bold, italic, links) ─────────────────────────── */

function renderInline(text: string): ReactNode[] {
  // Tokenize inline code first (so its content isn't further parsed).
  const nodes: ReactNode[] = [];
  const codeRe = /`([^`]+)`/;
  let rest = text;
  let key = 0;

  while (rest) {
    const m = rest.match(codeRe);
    if (!m) {
      nodes.push(...renderEmphasis(rest, key));
      break;
    }
    const before = rest.slice(0, m.index);
    if (before) nodes.push(...renderEmphasis(before, key));
    nodes.push(
      <code
        key={`c${key++}`}
        className="break-all px-1.5 py-0.5 rounded bg-surface-container text-[13px] font-mono text-brand-teal"
      >
        {m[1]}
      </code>
    );
    rest = rest.slice((m.index ?? 0) + m[0].length);
  }
  return nodes;
}

/** Parse **bold**, *italic*, and [text](url) from a plain (non-code) string. */
function renderEmphasis(text: string, baseKey: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/;
  let rest = text;
  let key = baseKey * 1000;

  while (rest) {
    const m = rest.match(re);
    if (!m) {
      nodes.push(rest);
      break;
    }
    const before = rest.slice(0, m.index);
    if (before) nodes.push(before);

    if (m[2] !== undefined) {
      nodes.push(
        <strong key={`b${key++}`} className="font-semibold text-ink">
          {m[2]}
        </strong>
      );
    } else if (m[3] !== undefined) {
      nodes.push(
        <em key={`i${key++}`} className="italic">
          {m[3]}
        </em>
      );
    } else if (m[4] !== undefined && m[5] !== undefined) {
      nodes.push(
        <a
          key={`l${key++}`}
          href={m[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-brand-teal underline underline-offset-2 hover:text-ink"
        >
          {m[4]}
        </a>
      );
    }
    rest = rest.slice((m.index ?? 0) + m[0].length);
  }
  return nodes;
}

/* ─── Code block with copy button ───────────────────────────────────────── */

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative min-w-0 max-w-full rounded-xl border border-hairline bg-ink overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-ink/90 border-b border-white/10">
        <span className="text-[11px] font-mono text-canvas/60 uppercase tracking-wide select-none">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          aria-label={`Copy ${lang || "code"} snippet`}
          className="focus-ring inline-flex items-center px-2 py-1 my-[-2px] rounded text-[11px] font-medium text-canvas/70 hover:text-canvas transition-colors"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-canvas font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}