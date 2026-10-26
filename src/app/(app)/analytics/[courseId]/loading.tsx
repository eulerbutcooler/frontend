import { Skeleton } from "@/components/ui/skeleton";

export default function CourseAnalyticsLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-7 w-64" />
        </div>
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-28"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>

        {/* Lessons and Quizzes Grid */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
