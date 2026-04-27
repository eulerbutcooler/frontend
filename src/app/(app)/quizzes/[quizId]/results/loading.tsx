import { Skeleton } from "@/components/ui/skeleton";

export default function QuizResultsLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Skeleton className="h-48 rounded-[24px] mb-12" />
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
