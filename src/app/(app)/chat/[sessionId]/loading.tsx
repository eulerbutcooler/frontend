import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSessionLoading() {
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
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            {/* User message */}
            <div className="flex justify-end">
              <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-sm bg-gray-100" />
            </div>
            {/* Assistant message */}
            <div className="flex items-start gap-3">
              <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-1/2 rounded-2xl rounded-tr-sm bg-gray-100" />
            </div>
            {/* Assistant message */}
            <div className="flex items-start gap-3">
              <Skeleton className="w-7 h-7 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
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
