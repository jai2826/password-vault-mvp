import z from "zod";

export const createItemSchema = z.object({
  title: z.string(),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Minimum of 8 characters required"),
  url: z.url().optional(),
  notes: z.string().optional(),
});
export const updateItemSchema = z.object({
  title: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  password: z.string().min(8, "Minimum of 8 characters required").optional(),
  url: z.url().optional(),
  notes: z.string().optional(),
});
