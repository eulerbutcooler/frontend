import { z } from "zod";

export const createSessionSchema = z.object({
  course_id: z.string().uuid().optional().nullable(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
