import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="animate-fade-in">
      <div className="mb-12 space-y-4">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-5 w-[32rem]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[340px] rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}
