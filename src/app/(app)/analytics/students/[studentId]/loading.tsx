import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDetailLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Top Navigation & Student Header (Strictly horizontal) */}
      <div className="mb-4 flex-shrink-0 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide space-y-6">
        {/* ROW 1: Hero Identity Banner (8 cols) & Milestones Matrix (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-gray-900/90 rounded-2xl p-7 flex flex-col justify-between min-h-[260px]">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-gray-800" />
              <Skeleton className="h-5 w-24 bg-gray-800 rounded-full" />
            </div>
            <div className="my-4 space-y-2">
              <Skeleton className="h-8 w-64 bg-gray-800" />
              <Skeleton className="h-4 w-96 bg-gray-800" />
            </div>
            <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
              <Skeleton className="h-10 w-44 bg-gray-800" />
              <Skeleton className="h-9 w-28 bg-gray-800 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-4 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[260px]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-2 gap-3 my-2">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* ROW 2: 3 Bento Cards (4 cols each) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 h-[240px] flex flex-col justify-between">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="lg:col-span-4 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 h-[240px] flex flex-col justify-between">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="lg:col-span-4 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 h-[240px] flex flex-col justify-between">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* ROW 3: Single-student Standing Slate */}
        <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
