import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <Skeleton className="h-7 w-72 mb-1.5" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide space-y-8">
        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-28"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="w-7 h-7 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>

        {/* Assessment breakdown (5 cols) & Courses (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-4">
            <Skeleton className="h-5 w-44 pb-2 border-b border-gray-100" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-7 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-3">
            <Skeleton className="h-5 w-48 pb-2 border-b border-gray-100" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Live Student Directory & Standings Slate */}
        <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <Skeleton className="h-5 w-56 mb-1" />
              <Skeleton className="h-3.5 w-80" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-52 rounded-lg" />
              <Skeleton className="h-9 w-44 rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
