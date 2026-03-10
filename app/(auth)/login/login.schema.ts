import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password"),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
