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

export function useStreamChat(sessionId: string): UseStreamChatReturn {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isStreaming) return;

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

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return updated;
          });
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
