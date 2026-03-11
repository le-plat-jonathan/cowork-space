import z from "zod";

export const RegisterFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password"),
});

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;
