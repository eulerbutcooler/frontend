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
  const { sessionId } = useParams<{ sessionId: string }>();

  const { data: session } = useQuery({
    queryKey: ["chat-session", sessionId],
    queryFn: () =>
      clientApi.get<ChatSession[]>("/api/v1/chat/sessions").then(
        (sessions) => sessions.find((s) => s.id === sessionId) ?? null
      ),
    enabled: !!sessionId,
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ["chat-history", sessionId],
    queryFn: () =>
      clientApi.get<Message[]>(
        `/api/v1/chat/sessions/${sessionId}/history`
      ),
    enabled: !!sessionId,
  });

  const { messages, isStreaming, error, sendMessage, setMessages } =
    useStreamChat(sessionId);

  useEffect(() => {
    if (history && messages.length === 0) {
      setMessages(historyToStreamMessages(history));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

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
