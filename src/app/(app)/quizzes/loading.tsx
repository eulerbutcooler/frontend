import { Skeleton } from "@/components/ui/skeleton";

export default function QuizzesLoading() {
  return (
    <div className="animate-fade-in">
      <div className="mb-12 space-y-4">
        <Skeleton className="h-16 w-72" />
        <Skeleton className="h-6 w-[32rem]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
