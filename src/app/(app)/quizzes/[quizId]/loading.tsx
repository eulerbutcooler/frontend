import { Skeleton } from "@/components/ui/skeleton";

export default function QuizTakeLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full mb-8" />
      <Skeleton className="h-6 w-24 rounded-full mb-10" />
      <Skeleton className="h-8 w-3/4 mx-auto mb-10" />
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <div className="flex justify-between mt-12 pt-8 border-t border-hairline">
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
    </div>
  );
}
