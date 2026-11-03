"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validations/course";
import {
  useCreateCourse,
  useUpdateCourse,
  useUploadCourseThumbnail,
} from "@/hooks/use-courses";
import { toFileProxyUrl } from "@/lib/file-url";
import { cleanSubjectDescription, getCourseBranch, getSpecializationMeta, isSpecializationBranch, SPECIALIZATION_BRANCHES, type SpecializationBranch } from "@/lib/course-utils";
import type { Course } from "@/types/course";
import { useEffect, useState } from "react";
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
  const uploadThumbnail = useUploadCourseThumbnail();
  const [serverError, setServerError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    toFileProxyUrl(initialData?.thumbnail_url) ?? null
  );
  const [thumbnailError, setThumbnailError] = useState("");

  const paramBranch = searchParams?.get("branch");
  const initialBranch: SpecializationBranch = initialData
    ? getCourseBranch(initialData)
    : paramBranch === "agniveer"
      ? "avr_ae"
      : isSpecializationBranch(paramBranch)
        ? paramBranch
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

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setThumbnailError("Use a PNG, JPG, or WEBP image.");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setThumbnailError("Image must be 2 MB or smaller.");
      e.target.value = "";
      return;
    }

    setThumbnailError("");
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const onSubmit = async (data: CreateCourseInput) => {
    setServerError("");
    try {
      const branchMeta = getSpecializationMeta(branch);
      const branchTag = `[${branchMeta.tag}]`;
      const cleanDesc = cleanSubjectDescription(data.description);
      const taggedDescription = `${branchTag} ${cleanDesc}`;
      const payload: CreateCourseInput = {
        ...data,
        rank: branch.startsWith("avr_")
          ? "apprentice"
          : data.rank || initialData?.rank || "officer",
        description: taggedDescription,
      };

      let courseId: string;

      if (isEdit) {
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        courseId = initialData.id;
      } else {
        const course = await createMutation.mutateAsync(payload);
        courseId = course.id;
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`aeromentor_branch_${courseId}`, branch);
        } catch {}
      }

      if (thumbnailFile) {
        try {
          await uploadThumbnail.mutateAsync({
            courseId,
            file: thumbnailFile,
          });
          setThumbnailFile(null);
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Thumbnail upload failed."
          );
        }
      }

      router.push(`/courses/${courseId}/edit`);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {SPECIALIZATION_BRANCHES.map((spec) => {
                  const selected = branch === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setBranch(spec.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        selected
                          ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-2xs"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-9 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-extrabold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {spec.shortCode}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-[13px] font-bold leading-tight ${
                            selected ? "text-blue-950" : "text-gray-900"
                          }`}
                        >
                          {spec.name}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          {spec.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
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
              <label
                htmlFor="course-thumbnail"
                className="relative w-full h-[140px] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group overflow-hidden"
              >
                <input
                  id="course-thumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleThumbnailChange}
                />

                {thumbnailPreview ? (
                  <>
                    <Image
                      src={thumbnailPreview}
                      alt="Subject thumbnail preview"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[12px] font-semibold">
                        Click to replace
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ImagePlus className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-[13px] font-medium text-gray-900 mb-1">
                      Click to upload image
                    </p>
                    <p className="text-[11px] text-gray-500">
                      PNG, JPG or WEBP (Max 2MB)
                    </p>
                  </>
                )}
              </label>

              {thumbnailError && (
                <p className="text-[11px] text-red-500 mt-1">{thumbnailError}</p>
              )}
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

      {isEdit && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save details"}
          </Button>
        </div>
      )}
    </form>
  );
}
