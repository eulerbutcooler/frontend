import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-5 w-[480px]" />
      </div>

      {/* Bento grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Skeleton className="md:col-span-4 h-[220px] rounded-[24px]" />
        <Skeleton className="md:col-span-8 h-[220px] rounded-[24px]" />
        <Skeleton className="md:col-span-4 h-[200px] rounded-[24px]" />
        <Skeleton className="md:col-span-4 h-[200px] rounded-[24px]" />
        <Skeleton className="md:col-span-4 h-[200px] rounded-[24px]" />
      </div>

      {/* Recent section skeleton */}
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
