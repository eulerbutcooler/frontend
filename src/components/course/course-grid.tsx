import { Plus } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "./course-card";
import type { Course } from "@/types/course";

interface CourseGridProps {
  courses: Course[];
  isInstructor?: boolean;
  newSubjectHref?: string;
  emptyBranchName?: string;
}

export function CourseGrid({ courses, isInstructor, newSubjectHref, emptyBranchName }: CourseGridProps) {
  const safeCourses = courses || [];
  if (safeCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full pointer-events-none pt-20">
        <div className="w-[48px] h-[48px] rounded-[14px] bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-5">
          <svg viewBox="0 0 30 24" className="w-[24px] h-[24px]" fill="none" aria-hidden="true">
            <path d="M29.3388 9.46767H18.448V0.00146484H14.9293V10.2725C14.9293 11.3634 15.36 12.411 16.1254 13.183L25.018 22.151L27.506 19.6419L20.938 13.0183H29.3408V9.46975L29.3388 9.46767Z" fill="#2563eb" stroke="#2563eb" strokeWidth="0.5"></path>
            <path d="M1.82839 4.36056L8.39633 10.9842H-0.00646973V14.5328H10.8843V23.999H14.403V13.728C14.403 12.637 13.9723 11.5894 13.2069 10.8175L4.31635 1.85147L1.82839 4.36056Z" fill="#2563eb" stroke="#2563eb" strokeWidth="0.5"></path>
          </svg>
        </div>
        <h2 className="text-[16px] font-bold text-gray-900 tracking-tight mb-2">No subjects available</h2>
        <p className="text-[13px] text-gray-500 max-w-sm text-center mb-6">
          {isInstructor
            ? `Your curriculum is empty. Start building your first subject module ${emptyBranchName ? `in ${emptyBranchName}` : ""} to get trainees onboard.`
            : "Check back soon, new subjects are currently being prepared."}
        </p>

        {isInstructor && (
          <Link
            href={newSubjectHref || "/courses/new"}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium rounded-lg transition-colors pointer-events-auto cursor-pointer shadow-2xs"
          >
            <Plus className="h-4 w-4 text-gray-500" />
            Create Subject
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {safeCourses.map((course, i) => (
        <CourseCard key={course.id || i} course={course} index={i} />
      ))}
    </div>
  );
}
