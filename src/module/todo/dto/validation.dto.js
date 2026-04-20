import { z } from "zod";

export const createValidator = z.object({
  title: z.string().trim().min(2).max(120),
  content: z.string().trim().min(10),
  status: z.enum(["pending", "completed"]).default("pending"),
});

export const updateValidator = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  content: z.string().trim().min(10).optional(),
  status: z.enum(["pending", "completed"]).optional(),
});
