import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long" }),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  initialStock: z
    .number()
    .int({ message: "Initial stock must be a whole number" })
    .min(0, { message: "Initial stock cannot be negative" }),
});

export const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long" }),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Price must be a positive number" }),
});

export const AdjustInventorySchema = z.object({
  stockChange: z.coerce
    .number()
    .int({ message: "Stock change must be a whole number" })
    .refine((val) => val !== 0, { message: "Stock change cannot be zero" }),
});

// Types inferred from schemas
export type LoginFormValues = z.infer<typeof LoginSchema>;

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;
export type UpdateProductFormValues = z.infer<typeof UpdateProductSchema>;

export type AdjustInventoryFormValues = z.infer<typeof AdjustInventorySchema>;
