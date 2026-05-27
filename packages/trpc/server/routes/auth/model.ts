import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  isVerified: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const authResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const messageSchema = z.object({
  message: z.string(),
});
