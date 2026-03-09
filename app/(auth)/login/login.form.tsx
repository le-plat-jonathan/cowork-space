"use client";

import { Typography } from "@/components/ui/typography";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginFormSchema, LoginFormType } from "./login.schema";

export function LoginForm() {
  const router = useRouter();

  const submitMutation = useMutation({
    mutationFn: async (values: LoginFormType) => {
      await unwrapSafePromise(
        authClient.signIn.email({
          email: values.email,
          password: values.password,
        }),
      );

      return { redirect: "/app" };
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      router.push(data.redirect as never);
    },
  });

  const form = useForm({
    schema: LoginFormSchema,
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await submitMutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4 p-6 md:p-8">
      <div>
        <Typography className="text-center" variant="h2">
          Se connecter
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

      <form.AppField name="password">
        {(field) => (
          <field.Field>
            <div className="flex items-center justify-between">
              <field.Label>Mot de passe</field.Label>
              <Link
                href="/forgot-password"
                className="text-xs text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <field.Content>
              <field.Input type="password" placeholder="*******" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton className="w-full mt-1">
        Se connecter
      </form.SubmitButton>

      <div className="flex items-center justify-center">
        <Typography variant="p" className="text-muted-foreground">
          Vous n&apos;avez pas de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Créer un compte
          </Link>
        </Typography>
      </div>
    </Form>
  );
}
