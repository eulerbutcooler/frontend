import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <Skeleton className="h-7 w-48 mb-1.5" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Main Container with 2 columns */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Main Chat Box Skeleton */}
        <div className="flex-[4] bg-white border border-gray-200 rounded-xl p-8 flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-4">
            <Skeleton className="w-12 h-12 rounded-[14px]" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="max-w-3xl mx-auto w-full pt-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="flex-[1] min-w-[240px] max-w-[300px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-2 pt-1">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
