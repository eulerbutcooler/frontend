"use client";

import { CourseForm } from "@/components/course/course-form";

export default function CreateCoursePage() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-caption-uppercase uppercase text-brand-teal tracking-widest mb-2">
          Instructor Studio
        </p>
        <h1 className="font-display text-display-sm text-ink font-semibold">
          Create New Course
        </h1>
      </div>

      <div className="max-w-2xl">
        <CourseForm />
      </div>
    </div>
  );
}
