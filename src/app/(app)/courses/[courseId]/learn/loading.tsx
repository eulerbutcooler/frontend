import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLearnLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 px-2 shrink-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-none">
        {/* Main Content Area */}
        <div className="flex-1 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="space-y-4">
            <Skeleton className="h-7 w-64 mb-4" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        {/* Right Sidebar Syllabus */}
        <div className="w-full lg:w-80 bg-[#fafbfc] p-6 space-y-4 shrink-0">
          <Skeleton className="h-5 w-36 pb-2 border-b border-gray-200" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3"
              >
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
