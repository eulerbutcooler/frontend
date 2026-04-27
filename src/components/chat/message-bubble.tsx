import { cn } from "@/lib/utils";
import { SourceCitation } from "./source-citation";
import type { Citation } from "@/types/chat";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export function MessageBubble({
  role,
  content,
  citations = [],
  isStreaming,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 max-w-[85%] animate-fade-in",
        isUser && "self-end flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
          isUser
            ? "bg-brand-lavender text-ink border border-hairline"
            : "bg-surface-card text-surface-tint border border-hairline"
        )}
      >
        <span className="text-[11px] font-bold font-display select-none">
          {isUser ? "You" : "AI"}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "px-5 py-4 rounded-2xl text-ink text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap",
            isUser
              ? "bg-brand-peach rounded-tr-sm"
              : "bg-surface-card rounded-tl-sm"
          )}
        >
          {content}
          {isStreaming && !content && (
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full animate-bounce [animation-delay:0.3s]" />
            </span>
          )}
        </div>
        {citations.length > 0 && (
          <SourceCitation citations={citations} />
        )}
      </div>
    </div>
  );
}
