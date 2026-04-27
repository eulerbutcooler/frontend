"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import { useCreateChatSession } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import type { ChatSession } from "@/types/chat";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ChatListPage() {
  const router = useRouter();
  const createSession = useCreateChatSession();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["chat-sessions"],
    queryFn: () => clientApi.get<ChatSession[]>("/api/v1/chat/sessions"),
  });

  const handleNewChat = async () => {
    const session = await createSession.mutateAsync({});
    router.push(`/chat/${session.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="font-display text-display-xl text-ink mb-2">
            AeroMentor AI
          </h1>
          <p className="text-title-lg text-surface-tint">
            Ask questions about your course materials with AI-powered search.
          </p>
        </div>
        <Button
          onClick={handleNewChat}
          disabled={createSession.isPending}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-surface-card rounded-[24px] border border-hairline p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-soft mx-auto mb-6 flex items-center justify-center border border-hairline font-display text-2xl select-none text-surface-tint">
            AI
          </div>
          <h3 className="font-display text-display-sm text-ink mb-2">
            No conversations yet
          </h3>
          <p className="text-body-md text-surface-tint max-w-md mx-auto mb-6">
            Start a new chat to ask questions about your course materials.
          </p>
          <Button onClick={handleNewChat} className="gap-2">
            <Plus className="h-4 w-4" />
            Start First Chat
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, idx) => (
            <button
              key={session.id ?? idx}
              onClick={() => router.push(`/chat/${session.id}`)}
              className="w-full bg-white border border-hairline rounded-2xl p-5 flex items-center gap-4 hover:border-outline-variant transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center shrink-0 border border-hairline group-hover:bg-surface-soft transition-colors font-display font-bold text-sm text-surface-tint select-none">
                {session.title?.charAt(0)?.toUpperCase() ?? "—"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-title-md font-semibold text-ink truncate">
                  {session.title}
                </h3>
                <p className="text-caption text-outline mt-0.5">
                  {formatDate(session.updated_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
