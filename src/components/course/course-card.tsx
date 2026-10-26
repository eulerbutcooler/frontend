import Image from "next/image";
import Link from "next/link";
import { cn, capitalize } from "@/lib/utils";
import { cleanSubjectDescription, getCourseBranch } from "@/lib/course-utils";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  index: number;
}

export const IMAGES = [
  '/images/suk2.webp',
  '/images/1.webp',
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.webp',
  '/images/5.webp',
];

export const getCourseImage = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return IMAGES[Math.abs(hash) % IMAGES.length];
};

export function CourseCard({ course, index }: CourseCardProps) {
  const bgImage = getCourseImage(course.id);
  const branch = getCourseBranch(course).toUpperCase();

  return (
    <Link href={`/courses/${course.id}`} className="block w-full">
      <article className="relative bg-white border border-gray-200 rounded-xl overflow-hidden group aspect-[4/3] cursor-pointer">
        
        {/* Image Container with initial scale to hide white edges and parallax zoom on hover */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-100">
          <Image
            src={bgImage}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 4}
            className="object-cover object-center scale-[1.15] group-hover:scale-[1.22] group-hover:-translate-y-2 transition-transform duration-300 ease-out"
          />
        </div>

        {/* Bottom Info Card - Slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-white h-[35%] group-hover:h-[55%] transition-all duration-300 ease-out flex flex-col pt-4 px-5 pb-5 rounded-t-xl shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-start shrink-0">
            <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                {branch}
              </span>
              {!course.published && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                  Draft
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out delay-75 text-[13px] text-gray-500 leading-relaxed line-clamp-3">
            {cleanSubjectDescription(course.description)}
          </div>
        </div>
      </article>
    </Link>
  );
}
