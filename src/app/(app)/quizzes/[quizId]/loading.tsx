import { Skeleton } from "@/components/ui/skeleton";

export default function QuizTakeLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-7 w-56" />
        </div>
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide flex flex-col justify-between max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {/* Progress bar */}
          <Skeleton className="h-2 w-full rounded-full" />

          {/* Question Prompt */}
          <div className="p-6 bg-[#fafbfc] border border-gray-200 rounded-2xl space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* 4 Options */}
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-3"
              >
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation bar */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-8">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
