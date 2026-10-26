import { ChatView } from "@/components/chat/chat-view";

interface ChatSessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ChatSessionPage({ params }: ChatSessionPageProps) {
  const { sessionId } = await params;
  return <ChatView initialSessionId={sessionId} />;
}
