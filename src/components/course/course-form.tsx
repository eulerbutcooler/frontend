"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RANKS } from "@/types/user";
import { capitalize } from "@/lib/utils";
import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validations/course";
import { useCreateCourse, useUpdateCourse } from "@/hooks/use-courses";
import type { Course } from "@/types/course";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CourseFormProps {
  initialData?: Course;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          rank: initialData.rank as CreateCourseInput["rank"],
        }
      : undefined,
  });

  const onSubmit = async (data: CreateCourseInput) => {
    setServerError("");
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        router.push(`/courses/${initialData.id}`);
      } else {
        const course = await createMutation.mutateAsync(data);
        router.push(`/courses/${course.id}`);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-lavender to-brand-teal" />

        <h2 className="text-title-lg font-semibold text-ink mb-6">
          {isEdit ? "Edit Course" : "Basic Information"}
        </h2>

        {serverError && (
          <div role="alert" className="bg-error/10 text-error text-body-sm font-semibold p-4 rounded-xl mb-6">
            {serverError}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              placeholder="e.g. Aerodynamics 101"
              className="mt-2"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="title-error" className="text-body-sm text-error font-semibold mt-1.5">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="rank">Target Rank</Label>
            <div className="relative mt-2">
              <select
                id="rank"
                aria-invalid={!!errors.rank}
                aria-describedby={errors.rank ? "rank-error" : undefined}
                className="focus-ring w-full bg-canvas border border-hairline rounded-xl h-11 px-4 pr-10 text-body-md text-ink outline-none appearance-none cursor-pointer"
                {...register("rank")}
              >
                <option value="">Select rank...</option>
                {RANKS.map((r) => (
                  <option key={r} value={r}>
                    {capitalize(r)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-tint" />
            </div>
            {errors.rank && (
              <p id="rank-error" className="text-body-sm text-error font-semibold mt-1.5">
                {errors.rank.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the course content and objectives..."
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
              className="focus-ring mt-2 w-full bg-canvas border border-hairline rounded-xl p-4 text-body-md text-ink outline-none resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p id="description-error" className="text-body-sm text-error font-semibold mt-1.5">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-hairline">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create & Add Content"}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
