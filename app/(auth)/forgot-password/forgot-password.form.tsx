"use client";

import { Typography } from "@/components/ui/typography";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "./forgot-password.schema";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (values: ForgotPasswordType) => {
      await unwrapSafePromise(
        authClient.requestPasswordReset({
          email: values.email,
          redirectTo: "/reset-password",
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const form = useForm({
    schema: ForgotPasswordSchema,
    defaultValues: {
      email: "",
    },
    onSubmit: async (values) => {
      await submitMutation.mutateAsync(values);
    },
  });

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 md:p-8text-center">
        <CheckCircle className="size-10 text-green-500" />
        <p className="text-sm font-medium text-[#0f2340]">Email envoyé !</p>
        <p className="text-xs text-slate-500">
          Si un compte est associé à cette adresse, vous recevrez un lien de
          réinitialisation dans quelques minutes.
        </p>
        <Link
          href="/login"
          className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <Form form={form} className="flex flex-col gap-4 p-6 md:p-8">
      <div>
        <Typography className="text-center" variant="h2">
          Réinitialiser
        </Typography>
      </div>
      <form.AppField name="email">
        {(field) => (
          <field.Field>
            <field.Label>Email</field.Label>
            <field.Content>
              <field.Input type="email" placeholder="name@domaine.com" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton className="w-full mt-1">
        Envoyer le lien
      </form.SubmitButton>

      <Link
        href="/login"
        className="text-center text-xs text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline"
      >
        Retour à la connexion
      </Link>
    </Form>
  );
}
