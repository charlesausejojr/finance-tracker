import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  balance: z.number().optional(),
});

export const createTransactionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be either income or expense" }),
  }),
  date: z.coerce.date(),
  categoryTitle: z.string().min(1, "Category is required"),
});

export const updateTransactionSchema = z.object({
  id: z.string().min(1, "Transaction ID is required"), // still required to know which record to update
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive").optional(),
  type: z.enum(["income", "expense"]).optional(),
  date: z.coerce.date().optional(),
  categoryId: z.string().optional(),
  categoryTitle: z.string().optional(),
});

export const createCategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const updateCategorySchema = z.object({
  title: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
