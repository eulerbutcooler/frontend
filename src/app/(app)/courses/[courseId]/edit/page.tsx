import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { api } from "@/lib/api-client";
import { CourseForm } from "@/components/course/course-form";
import type { Course } from "@/types/course";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  let course: Course;
  try {
    course = await api.get<Course>(`/api/v1/courses/${courseId}`);
  } catch {
    notFound();
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-caption-uppercase uppercase text-brand-teal tracking-widest mb-2">
          Instructor Studio
        </p>
        <h1 className="font-display text-display-sm text-ink font-semibold">
          Edit Course
        </h1>
      </div>

      <div className="max-w-2xl">
        <CourseForm initialData={course} />
      </div>
    </div>
  );
}
