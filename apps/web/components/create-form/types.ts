import { z } from "zod";

export const createFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be under 255 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(150, "Slug must be under 150 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().max(1000).optional(),
  allowResponseEdit: z.boolean(),
  responseLimit: z
    .number()
    .int()
    .positive("Must be a positive number")
    .optional(),
  expiresAt: z.date().optional(),
  passwordNeeded: z.boolean(),
  password: z
    .string()
    .max(255, "Password must be under 255 characters")
    .optional(),
}).refine(
  (data) => {
    if (data.passwordNeeded && (!data.password || data.password.trim() === "")) {
      return false;
    }
    return true;
  },
  {
    message: "A password is required when password protection is enabled",
    path: ["password"],
  }
);

export type CreateFormValues = z.infer<typeof createFormSchema>;

export const defaultValues: CreateFormValues = {
  title: "",
  slug: "",
  description: "",
  allowResponseEdit: false,
  responseLimit: undefined,
  expiresAt: undefined,
  passwordNeeded: false,
  password: "",
};
