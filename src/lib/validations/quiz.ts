import { z } from "zod";

export const submitAnswerSchema = z.object({
  question_id: z.string().uuid("Invalid question ID"),
  answer: z.string().min(1, "Answer is required"),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
