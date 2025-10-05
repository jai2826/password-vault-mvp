import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export const registerSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8, "Minimum of 8 characters required"),
});