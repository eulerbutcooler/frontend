import { z } from "zod";
import { RANKS } from "@/types/user";

export const createCourseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  rank: z.enum(RANKS, { message: "Select a rank" }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema;
export type UpdateCourseInput = CreateCourseInput;

export const createLessonSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  order_idx: z.number().int().min(0).default(0),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = createLessonSchema;
export type UpdateLessonInput = CreateLessonInput;
