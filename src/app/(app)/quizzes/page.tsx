import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { QuizCard } from "@/components/quiz/quiz-card";
import type { Quiz } from "@/types/quiz";
import type { Course } from "@/types/course";

interface CourseWithQuizzes {
  course: Course;
  quizzes: Quiz[];
}

export default async function QuizzesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  let courses: Course[] = [];
  try {
    const fetchedCourses = await api.get<Course[]>("/api/v1/courses");
    courses = fetchedCourses || [];
  } catch {
    // API unreachable
  }

  const courseQuizGroups: CourseWithQuizzes[] = [];
  for (const course of courses) {
    try {
      const quizzes = await api.get<Quiz[]>(
        `/api/v1/courses/${course.id}/quizzes`
      );
      if (quizzes.length > 0) {
        courseQuizGroups.push({ course, quizzes });
      }
    } catch {
      // Skip
    }
  }

  return (
    <div>
      <header className="mb-12">
        <h1 className="font-display text-display-xl text-ink mb-4">
          Skill Validation
        </h1>
        <p className="text-title-lg text-surface-tint max-w-2xl">
          Master your technical knowledge with targeted assessments. Complete
          these drills to validate your understanding.
        </p>
      </header>

      {courseQuizGroups.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-hairline p-16 text-center">
          <h3 className="font-display text-display-sm text-ink mb-2">
            No quizzes available
          </h3>
          <p className="text-body-md text-surface-tint max-w-md mx-auto">
            Quizzes are generated automatically when course files are ingested.
            Check back after uploading materials.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {courseQuizGroups.map(({ course, quizzes }) => (
            <section key={course.id}>
              <h2 className="font-display text-display-sm text-ink mb-6">
                {course.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz, i) => (
                  <QuizCard key={quiz.id} quiz={quiz} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
