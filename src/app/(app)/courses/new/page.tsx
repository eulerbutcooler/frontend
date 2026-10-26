import { Suspense } from "react";
import { CourseForm } from "@/components/course/course-form";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default async function NewCoursePage() {
  const session = await auth();
  const isInstructor = session?.user?.role === "instructor";

  if (!isInstructor) {
    redirect("/courses");
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
          Subject builder studio...
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center justify-center h-8 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            form="course-form"
            className="flex items-center justify-center h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Create & Add Content
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide flex justify-center">
        <div className="w-full max-w-4xl">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          }>
            <CourseForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
