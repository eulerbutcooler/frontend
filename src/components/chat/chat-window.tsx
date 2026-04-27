"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import type { Citation } from "@/types/chat";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  created_at: string;
}

interface ChatWindowProps {
  sessionTitle?: string;
  messages: ChatMessage[];
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-[24px] border border-hairline flex flex-col h-[calc(100vh-12rem)] min-h-[600px] shadow-sm overflow-hidden">
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
            <p className="text-[13px] text-outline">
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
        className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 scrollbar-hide"
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
