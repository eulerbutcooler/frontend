import { z } from "zod";
import { RANKS } from "@/types/user";

export const loginSchema = z.object({
  enrollment_id: z.string().min(1, "Service Number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  enrollment_id: z.string().min(1, "Service Number is required"),
  rank: z.enum(RANKS, { message: "Select a rank" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "instructor"] as const, {
    message: "Select a role",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
