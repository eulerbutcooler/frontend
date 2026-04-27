import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSessionLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Skeleton className="h-[calc(100vh-12rem)] rounded-[24px]" />
    </div>
  );
}
