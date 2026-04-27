import { z } from "zod";

export const createSessionSchema = z.object({
  course_id: z.string().uuid().optional().nullable(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const sendMessageSchema = z.object({
  query: z.string().min(1, "Message cannot be empty"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
