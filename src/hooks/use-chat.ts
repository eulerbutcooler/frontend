import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import type { ChatSession, Message } from "@/types/chat";
import type { CreateSessionInput } from "@/lib/validations/chat";

export const chatSessionListOptions = () =>
  queryOptions({
    queryKey: ["chat-sessions"],
    queryFn: () => clientApi.get<ChatSession[]>("/api/v1/chat/sessions"),
  });

export const chatHistoryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: ["chat-history", sessionId],
    queryFn: () =>
      clientApi.get<Message[]>(
        `/api/v1/chat/sessions/${sessionId}/history`
      ),
    enabled: !!sessionId,
  });

export function useChatSessions() {
  return useSuspenseQuery(chatSessionListOptions());
}

export function useChatHistory(sessionId: string) {
  return useSuspenseQuery(chatHistoryOptions(sessionId));
}

export function useCreateChatSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionInput) =>
      clientApi.post<ChatSession>("/api/v1/chat/sessions", data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["chat-sessions"] }),
  });
}
