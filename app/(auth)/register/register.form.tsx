"use client";

import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterFormSchema, RegisterFormType } from "./register.schema";

type RegisterFormProps = {
  subdomain?: string | null;
  callbackUrl?: string;
};

export function RegisterForm({ subdomain, callbackUrl }: RegisterFormProps) {
  const router = useRouter();

  const submitMutation = useMutation({
    mutationFn: async (values: RegisterFormType) => {
      const result = await unwrapSafePromise(
        authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
        }),
      );

      return { redirect: "/login" };
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      router.push(data.redirect as never);
    },
  });

  const form = useForm({
    schema: RegisterFormSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await submitMutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="flex flex-col gap-4 p-6 md:p-8">
      <form.AppField name="name">
        {(field) => (
          <field.Field>
            <field.Label>Nom</field.Label>
            <field.Content>
              <field.Input placeholder="Nom complet" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>
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
            </div>
            <field.Content>
              <field.Input type="password" placeholder="*******" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton className="w-full mt-1">
        M&apos;inscrire
      </form.SubmitButton>
    </Form>
  );
}
