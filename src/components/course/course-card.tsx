import Link from "next/link";
import { cn, capitalize, BRAND_COLORS, DARK_TEXT_COLORS } from "@/lib/utils";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  const colorClass = BRAND_COLORS[index % BRAND_COLORS.length];
  const isDark = DARK_TEXT_COLORS.has(colorClass);

  return (
    <Link href={`/courses/${course.id}`}>
      <article
        className={cn(
          colorClass,
          "rounded-[24px] p-8 flex flex-col justify-between min-h-[340px] shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
        )}
      >
        <div>
          <div className="flex justify-between items-start mb-6">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-caption-uppercase uppercase",
                isDark
                  ? "bg-white/20 text-white"
                  : "bg-white/30 text-ink"
              )}
            >
              {capitalize(course.rank)}
            </span>
            <div className="flex items-center gap-2">
              {!course.published && (
                <span className="px-2 py-0.5 rounded-full text-caption bg-white/40 text-ink">
                  Draft
                </span>
              )}
              <span
                className={cn(
                  "w-2 h-2 rounded-full opacity-50",
                  isDark ? "bg-white" : "bg-ink"
                )}
              />
            </div>
          </div>
          <h3
            className={cn(
              "font-display text-display-sm mb-2",
              isDark ? "text-white" : "text-ink"
            )}
          >
            {course.title}
          </h3>
          <p
            className={cn(
              "text-body-md line-clamp-3",
              isDark ? "text-white/80" : "text-ink/80"
            )}
          >
            {course.description}
          </p>
        </div>
        <div className="mt-6">
          <span className="w-full bg-white text-ink text-button font-semibold h-[44px] rounded-xl hover:bg-surface-soft transition-colors flex items-center justify-center">
            Enter Course
          </span>
        </div>
      </article>
    </Link>
  );
}
