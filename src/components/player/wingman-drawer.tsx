"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Logo } from "@/components/icons/Logo";
import { cn } from "@/lib/utils";
import { clientApi } from "@/lib/api-client.client";
import type { ChatSession, Citation } from "@/types/chat";

interface WingmanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slideTitle: string;
  slideBullets: string[];
  topicTitle: string;
  subjectTitle?: string;
  courseId?: string;
  formula?: string;
  warning?: string;
  slideIndex: number;
  totalSlides: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp?: string;
}

function parseSSE(buffer: string): {
  tokens: string;
  citations: Citation[] | null;
  done: boolean;
  remainder: string;
} {
  let tokens = "";
  let citations: Citation[] | null = null;
  let done = false;

  const lastNewline = buffer.lastIndexOf("\n");
  const remainder = lastNewline === -1 ? buffer : buffer.slice(lastNewline + 1);
  const lines =
    lastNewline === -1 ? [] : buffer.slice(0, lastNewline + 1).split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;

    const payload = trimmed.slice(5).trim();
    if (payload === "[DONE]") {
      done = true;
      continue;
    }

    try {
      const parsed = JSON.parse(payload);
      if (parsed.token !== undefined) {
        tokens += parsed.token;
      } else if (parsed.citations) {
        citations = parsed.citations as Citation[];
      } else if (parsed.error) {
        throw new Error(parsed.error);
      }
    } catch {
      tokens += payload;
    }
  }

  return { tokens, citations, done, remainder };
}

export function WingmanDrawer({
  isOpen,
  onClose,
  slideTitle,
  slideBullets,
  topicTitle,
  subjectTitle,
  courseId,
  formula,
  warning,
  slideIndex,
  totalSlides,
}: WingmanDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isStreaming]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    // Contextual prompt embedding the exact active slide content
    const contextualMessage = `[Current Context: Slide ${slideIndex + 1}/${totalSlides} of Topic "${topicTitle}"${
      subjectTitle ? ` in Subject "${subjectTitle}"` : ""
    }]:\n- Slide Title: ${slideTitle}\n- Slide Content:\n${slideBullets
      .map((b) => `  * ${b}`)
      .join("\n")}${formula ? `\n- Formula: ${formula}` : ""}${
      warning ? `\n- Note/Warning: ${warning}` : ""
    }\n\nTrainee Query: ${trimmed}`;

    const userMsgId = "user-" + Date.now();
    const assistantMsgId = "asst-" + Date.now();

    // Store user message with trimmed user query for clean display
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setInput("");
    setIsStreaming(true);

    // Lazily create or reuse chat session in PostgreSQL
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      try {
        const payload = {
          course_id: courseId && courseId.length === 36 ? courseId : null,
        };
        const session = await clientApi.post<ChatSession>("/api/v1/chat/sessions", payload);
        activeSessionId = session.id;
        setSessionId(session.id);
      } catch (err) {
        console.error("Failed to initialize session with course_id, retrying without course_id", err);
        try {
          const session = await clientApi.post<ChatSession>("/api/v1/chat/sessions", {
            course_id: null,
          });
          activeSessionId = session.id;
          setSessionId(session.id);
        } catch (innerErr) {
          console.error("Failed to initialize chat session", innerErr);
        }
      }
    }

    if (!activeSessionId) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.id === assistantMsgId) {
          updated[updated.length - 1] = {
            ...last,
            content: "Unable to start a chat session. Please verify your connection and try again.",
          };
        }
        return updated;
      });
      setIsStreaming(false);
      return;
    }

    const abortCtrl = new AbortController();
    abortRef.current = abortCtrl;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          query: contextualMessage,
          message: contextualMessage,
          stream: true,
        }),
        signal: abortCtrl.signal,
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        try {
          const errData = await response.json();
          errorDetail = errData.error || errData.message || errorDetail;
        } catch {}
        throw new Error(errorDetail);
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { tokens, citations, done: isDone, remainder } = parseSSE(buffer);
        buffer = remainder;

        if (tokens || citations) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.id === assistantMsgId) {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + tokens,
                citations: citations || last.citations,
              };
            }
            return updated;
          });
        }

        if (isDone) break;
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.id === assistantMsgId && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: "Wingman temporarily encountered an issue connecting to the model server. Please try again.",
            };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <div
      className={cn(
        "h-full bg-white flex flex-col z-20 shadow-xl overflow-hidden transition-all duration-300 ease-in-out shrink-0",
        isOpen
          ? "w-[380px] lg:w-[420px] opacity-100 border-l border-gray-200"
          : "w-0 opacity-0 border-l-0 pointer-events-none"
      )}
    >
      {/* Inner Container keeping constant width during transition to prevent text squishing */}
      <div className="w-[380px] lg:w-[420px] h-full flex flex-col bg-white">
        {/* Drawer Header: Clean Wingman title with circular logo */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Logo className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
              Wingman
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Wingman"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12 text-gray-400 select-none">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-[13px] font-semibold text-gray-800">
                Ask about this slide
              </p>
              <p className="text-[12px] text-gray-400 max-w-[220px] mt-1 leading-relaxed">
                Clear doubts on formulas, concepts, or naval aviation procedures.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";

            // User Message: Grey box without logo, followed by a thin horizontal line
            if (isUser) {
              return (
                <div key={msg.id} className="w-full space-y-3">
                  <div className="flex justify-end w-full">
                    <div className="max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] text-gray-900 bg-gray-100 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                  <div className="w-full border-b border-gray-100" />
                </div>
              );
            }

            // Assistant Message: Circular logo on left, direct markdown text with NO box
            return (
              <div key={msg.id} className="flex gap-3 items-start w-full">
                {/* Circular logo for assistant message */}
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                  <Logo className="w-3.5 h-3.5 text-white" />
                </div>

                <div className="flex-1 min-w-0 text-gray-800 text-[13px] leading-relaxed">
                  <div className="prose prose-sm max-w-none text-gray-800 text-[13px] leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>li]:mb-1 [&>strong]:font-semibold [&>strong]:text-gray-900 [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-[12px] [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-2.5 [&>pre]:rounded-lg [&>pre]:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Assistant Thinking Indicator with circular logo and no box */}
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3 items-center w-full">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Logo className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-gray-400 ml-1">Wingman thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Wingman about this slide..."
            className="flex-1 h-9 px-3.5 text-[13px] bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
