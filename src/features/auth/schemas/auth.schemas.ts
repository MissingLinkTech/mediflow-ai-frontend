import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address").max(254);
const password = z.string().min(1, "Password is required").max(128);

export const loginSchema = z.object({ email, password });

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, "Name must be 100 characters or fewer")
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      "Name must be at least 2 characters",
    ),
  email,
  password: password
    .min(12, "Password must be at least 12 characters")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/\d/, "Include a number")
    .regex(/[^A-Za-z0-9]/, "Include a special character"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
