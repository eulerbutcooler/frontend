import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-7 w-64" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide space-y-8">
        {/* Course Hero Banner */}
        <div className="relative h-60 rounded-2xl overflow-hidden bg-gray-100 flex flex-col justify-end p-8 border border-gray-200">
          <Skeleton className="h-5 w-24 rounded-full mb-2 bg-gray-200" />
          <Skeleton className="h-8 w-96 mb-2 bg-gray-200" />
          <Skeleton className="h-4 w-2/3 bg-gray-200" />
        </div>

        {/* Content Columns: Lessons (8 cols) and Course Info (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 bg-[#fafbfc] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-4">
              <Skeleton className="h-5 w-32 pb-2 border-b border-gray-100" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-3">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
