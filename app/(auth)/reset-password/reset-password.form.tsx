"use client";

import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ResetPasswordSchema,
  ResetPasswordType,
} from "./reset-password.schema";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const submitMutation = useMutation({
    mutationFn: async (values: ResetPasswordType) => {
      await unwrapSafePromise(
        authClient.resetPassword({
          newPassword: values.password,
          token,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Mot de passe réinitialisé avec succès !");
      window.location.href = "/login";
    },
  });

  const form = useForm({
    schema: ResetPasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      await submitMutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4 p-6 md:p-8">
      <form.AppField name="password">
        {(field) => (
          <field.Field>
            <field.Label>Nouveau mot de passe</field.Label>
            <field.Content>
              <field.Input type="password" placeholder="*******" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {(field) => (
          <field.Field>
            <field.Label>Confirmer le mot de passe</field.Label>
            <field.Content>
              <field.Input type="password" placeholder="*******" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton className="w-full mt-1">
        Réinitialiser le mot de passe
      </form.SubmitButton>
    </Form>
  );
}
