"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import type { Message } from "@/types/chat";

interface ChatWindowProps {
  sessionTitle?: string;
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  onSend: (message: string) => void;
}

export function ChatWindow({
  sessionTitle,
  messages,
  isStreaming,
  error,
  onSend,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Only auto-scroll if the user is already near the bottom.
    // If they scrolled up to read history, don't yank them down.
    if (isNearBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    isNearBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  return (
    <div className="flex h-[calc(100dvh-7rem)] min-h-125 flex-col overflow-hidden rounded-3xl border border-hairline bg-surface-card shadow-sm md:h-[calc(100dvh-6rem)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-surface-card flex items-center justify-center border border-hairline font-display font-bold text-sm text-ink select-none">
              AI
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="text-title-md font-semibold text-ink tracking-tight">
              AeroMentor AI
            </h1>
            <p className="text-caption text-surface-tint">
              {sessionTitle
                ? `Session: ${sessionTitle}`
                : "Flight AI Assistant • Ready"}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        aria-live="polite"
        className="flex min-w-0 flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto p-6 md:p-8 scrollbar-hide"
      >
        {messages.length === 0 && !isStreaming && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-card flex items-center justify-center mb-6 border border-hairline font-display font-bold text-xl text-surface-tint select-none">
              AI
            </div>
            <h3 className="font-display text-display-sm text-ink mb-2">
              Ready for dialogue
            </h3>
            <p className="text-body-md text-surface-tint max-w-md">
              Ask questions about your course materials. I have access to all
              ingested documents and can cite my sources.
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isLastAssistant =
            msg.role === "assistant" && i === messages.length - 1;
          return (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              citations={msg.citations}
              isStreaming={isLastAssistant && isStreaming}
            />
          );
        })}

        {error && (
          <div className="bg-error/5 border border-error/20 rounded-2xl p-4 text-error text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}
