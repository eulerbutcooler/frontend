"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import { ChatWindow } from "@/components/chat/chat-window";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamChat, historyToStreamMessages } from "@/hooks/use-stream-chat";
import type { Message, ChatSession } from "@/types/chat";

export default function ChatSessionPage() {
  const params = useParams<{ sessionId?: string }>();
  const sessionId = params?.sessionId;

  // Guard against undefined sessionId (initial render, navigation, etc.)
  const isValidSessionId = !!sessionId && sessionId !== "undefined";

  const { data: session } = useQuery({
    queryKey: ["chat-session", sessionId],
    queryFn: () =>
      clientApi.get<ChatSession[]>("/api/v1/chat/sessions").then(
        (sessions) => sessions.find((s) => s.id === sessionId) ?? null
      ),
    enabled: isValidSessionId,
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ["chat-history", sessionId],
    queryFn: () =>
      clientApi.get<Message[]>(
        `/api/v1/chat/sessions/${sessionId}/history`
      ),
    enabled: isValidSessionId,
  });

  const { messages, isStreaming, error, sendMessage, setMessages } =
    useStreamChat(sessionId ?? "");

  useEffect(() => {
    if (history && messages.length === 0) {
      setMessages(historyToStreamMessages(history));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  if (!isValidSessionId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-error/5 border border-error/20 rounded-2xl p-8 text-center text-error">
          <h3 className="font-semibold text-lg mb-2">Invalid Chat Session</h3>
          <p className="text-sm">The session ID is missing or invalid. Please return to the chat list and try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Skeleton className="h-[calc(100vh-12rem)] rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ChatWindow
        sessionTitle={session?.title}
        messages={messages}
        isStreaming={isStreaming}
        error={error}
        onSend={sendMessage}
      />
    </div>
  );
}
