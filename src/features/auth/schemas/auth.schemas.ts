import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address").max(254);
const password = z.string().min(1, "Password is required").max(128);
const name = z
  .string()
  .trim()
  .max(100, "Name must be 100 characters or fewer")
  .refine((value) => value.length === 0 || value.length >= 2, "Name must be at least 2 characters");
const strongPassword = password
  .min(12, "Password must be at least 12 characters")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character");

export const loginSchema = z.object({ email, password });

export const signupSchema = z.object({
  name,
  email,
  password: strongPassword,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .trim()
    .min(20, "Reset token is missing or invalid")
    .max(128, "Reset token is invalid"),
  password: strongPassword,
});

export const changePasswordSchema = z
  .object({
    currentPassword: password,
    newPassword: strongPassword,
    confirmNewPassword: password,
  })
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export const updateSettingsSchema = z
  .object({
    name,
    locale: z.string().trim().min(2, "Locale is required").max(50),
    timezone: z.string().trim().min(1, "Timezone is required").max(100),
    notificationEmails: z.boolean(),
  })
  .partial();

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
