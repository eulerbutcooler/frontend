"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validations/course";
import { useCreateCourse, useUpdateCourse } from "@/hooks/use-courses";
import { cleanSubjectDescription, getCourseBranch, type SpecializationBranch } from "@/lib/course-utils";
import type { Course } from "@/types/course";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

interface CourseFormProps {
  initialData?: Course;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = !!initialData;
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const [serverError, setServerError] = useState("");

  const paramBranch = searchParams?.get("branch");
  const initialBranch: SpecializationBranch = initialData
    ? getCourseBranch(initialData)
    : paramBranch === "alo"
    ? "alo"
    : "aeo";

  const [branch, setBranch] = useState<SpecializationBranch>(initialBranch);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: cleanSubjectDescription(initialData.description),
          rank: (initialData.rank as CreateCourseInput["rank"]) || "officer",
        }
      : {
          rank: "officer",
        },
  });

  const onSubmit = async (data: CreateCourseInput) => {
    setServerError("");
    try {
      const branchTag = `[${branch.toUpperCase()}]`;
      const cleanDesc = cleanSubjectDescription(data.description);
      const taggedDescription = `${branchTag} ${cleanDesc}`;
      const payload: CreateCourseInput = {
        ...data,
        rank: data.rank || initialData?.rank || "officer",
        description: taggedDescription,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`aeromentor_branch_${initialData.id}`, branch);
          } catch {}
        }
        router.push(`/courses/${initialData.id}/edit`);
      } else {
        const course = await createMutation.mutateAsync(payload);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`aeromentor_branch_${course.id}`, branch);
          } catch {}
        }
        router.push(`/courses/${course.id}/edit`);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  return (
    <form id="course-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <div>
        {!isEdit && (
          <div className="mb-12">
            <div className="flex items-center shrink-0 w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="h-11 text-[14px] font-semibold text-gray-900 flex items-center justify-center w-full">
                Basic information to begin the draft
              </div>
            </div>
          </div>
        )}
        
        {serverError && (
          <div className="bg-red-50 text-red-600 border border-red-100 text-[13px] px-3 py-2 rounded-lg mb-8">
            {serverError}
          </div>
        )}

        <div className="space-y-8">
          {/* Branch Specialization Selector */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            <div>
              <Label className="text-[14px] font-semibold text-gray-900 block">Specialization Branch</Label>
              <p className="text-[13px] text-gray-500 mt-1">Assign this subject to a naval engineering specialization branch.</p>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBranch("aeo")}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    branch === "aeo"
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-2xs"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-extrabold ${
                    branch === "aeo" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                    AEO
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-bold ${branch === "aeo" ? "text-blue-950" : "text-gray-900"}`}>
                      AEO Branch
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">Air Engineer Officer</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBranch("alo")}
                  className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    branch === "alo"
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-2xs"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-extrabold ${
                    branch === "alo" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                    ALO
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-bold ${branch === "alo" ? "text-blue-950" : "text-gray-900"}`}>
                      ALO Branch
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">Air Electrical Officer</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            <div>
              <Label htmlFor="title" className="text-[14px] font-semibold text-gray-900 block">Subject Title</Label>
              <p className="text-[13px] text-gray-500 mt-1">Give your subject a clear and concise title.</p>
            </div>
            <div>
              <input
                id="title"
                placeholder="e.g. Flight Mechanics & Aerodynamics"
                className="h-9 text-[13px] placeholder:text-[13px] placeholder:text-gray-400 bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg w-full px-3 outline-none transition-colors border"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
              <input type="hidden" {...register("rank")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            <div>
              <Label className="text-[14px] font-semibold text-gray-900 block">Subject Thumbnail</Label>
              <p className="text-[13px] text-gray-500 mt-1">This is used in subject cards and catalog sections.</p>
            </div>
            <div>
              <div className="w-full h-[140px] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ImagePlus className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-[13px] font-medium text-gray-900 mb-1">Click to upload image</p>
                <p className="text-[11px] text-gray-500">PNG, JPG or WEBP (Max 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
            <div>
              <Label htmlFor="description" className="text-[14px] font-semibold text-gray-900 block">Description</Label>
              <p className="text-[13px] text-gray-500 mt-1">Describe what students will learn from this subject.</p>
            </div>
            <div>
              <textarea
                id="description"
                rows={8}
                placeholder="Describe the subject content and objectives..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-[13px] placeholder:text-[13px] placeholder:text-gray-400 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
