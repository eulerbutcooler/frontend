import { Skeleton } from "@/components/ui/skeleton";

export default function CourseAnalyticsLoading() {
  return (
    <div className="animate-fade-in">
      <Skeleton className="h-5 w-32 mb-8" />
      <div className="mb-12 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-[3/2] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl mb-12" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
