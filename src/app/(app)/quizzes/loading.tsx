import { Skeleton } from "@/components/ui/skeleton";

export default function QuizzesLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <Skeleton className="h-7 w-64 mb-1.5" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide space-y-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 bg-[#fafbfc] border border-gray-200 rounded-2xl space-y-5"
          >
            {/* Course Title and Meta */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="space-y-1">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-3.5 w-36" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* 3 Difficulty Tiles: Easy, Medium, Hard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col justify-between h-28"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-16 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
