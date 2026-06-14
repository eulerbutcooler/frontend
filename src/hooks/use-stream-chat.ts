import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Message, Citation } from "@/types/chat";

interface StreamMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  created_at: string;
}

interface UseStreamChatReturn {
  messages: StreamMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (query: string) => Promise<void>;
  setMessages: (messages: StreamMessage[]) => void;
}

let msgCounter = 0;

function createId(): string {
  return `msg-${Date.now()}-${++msgCounter}`;
}

/** Parse SSE frames from the raw chunk buffer.
 *  Returns {tokens: string, citations: Citation[] | null, done: boolean}
 *  and any incomplete line to carry over to the next chunk.
 */
function parseSSE(buffer: string): {
  tokens: string;
  citations: Citation[] | null;
  done: boolean;
  remainder: string;
} {
  let tokens = "";
  let citations: Citation[] | null = null;
  let done = false;

  // Split by newlines; keep any trailing partial line as remainder.
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
      // If JSON.parse fails, treat raw payload as plain text (fallback).
      tokens += payload;
    }
  }

  return { tokens, citations, done, remainder };
}

export function useStreamChat(sessionId: string): UseStreamChatReturn {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isStreaming || !sessionId) return;

      setError(null);

      const userMsg: StreamMessage = {
        id: createId(),
        role: "user",
        content: query,
        citations: [],
        created_at: new Date().toISOString(),
      };

      const assistantMsg: StreamMessage = {
        id: createId(),
        role: "assistant",
        content: "",
        citations: [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, query }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`Chat failed: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const decoded = decoder.decode(value, { stream: true });
          buffer += decoded;
          console.debug("[SSE] raw chunk:", decoded);
          const { tokens, citations: newCitations, done: isDone, remainder } =
            parseSSE(buffer);
          buffer = remainder;
          console.debug("[SSE] parsed tokens:", tokens, "citations:", newCitations, "done:", isDone);

          if (tokens || newCitations) {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last && last.role === "assistant") {
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + tokens,
                  citations: newCitations ?? last.citations,
                };
              }
              return updated;
            });
          }

          if (isDone) break;
        }

        queryClient.invalidateQueries({
          queryKey: ["chat-history", sessionId],
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [sessionId, isStreaming, queryClient]
  );

  return { messages, isStreaming, error, sendMessage, setMessages };
}

export function historyToStreamMessages(history: Message[]): StreamMessage[] {
  return history.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    citations: m.citations ?? [],
    created_at: m.created_at,
  }));
}
