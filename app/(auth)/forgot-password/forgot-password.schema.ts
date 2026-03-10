import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.email("Veuillez entrer une adresse email valide"),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
