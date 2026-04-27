import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <div className="animate-fade-in">
      <Skeleton className="h-5 w-32 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-7 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-5 w-96" />
          <Skeleton className="h-5 w-80" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-xl" />
          </div>
        </div>
        <div className="md:col-span-5">
          <Skeleton className="aspect-[4/3] rounded-[32px]" />
        </div>
      </div>

      <Skeleton className="h-10 w-48 mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}
