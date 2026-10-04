import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Name is required").max(120),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72),
    confirmPassword: z.string().min(8, "Confirm your password"),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name is required").max(120),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9_]+$/,
      "Username: lowercase letters, numbers, underscore only",
    ),
  college: z.string().min(2).max(200),
  city: z.string().min(2).max(120),
  skills: z.array(z.string()).min(1, "Pick at least one skill"),
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
  path: z.enum(["direct_selling", "learn_and_earn"]),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(120),
  bio: z.string().max(500).optional(),
  college: z.string().max(200).optional(),
  city: z.string().max(120).optional(),
  website: z.string().url().optional().or(z.literal("")),
  twitter: z.string().max(100).optional(),
  linkedin: z.string().max(200).optional(),
  instagram: z.string().max(100).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
