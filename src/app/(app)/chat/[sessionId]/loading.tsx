import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSessionLoading() {
  return (
    <div className="w-full animate-fade-in">
      <Skeleton className="h-[calc(100dvh-7rem)] min-h-125 rounded-3xl md:h-[calc(100dvh-6rem)]" />
    </div>
  );
}
