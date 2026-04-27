import { Skeleton } from "@/components/ui/skeleton";

export default function CourseEditLoading() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Skeleton className="h-5 w-32 mb-8" />
      <Skeleton className="h-10 w-48 mb-10" />
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
