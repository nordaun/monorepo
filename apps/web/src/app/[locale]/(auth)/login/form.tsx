"use client";

import { login } from "@/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { useTranslations } from "next-intl";
import { ChangeEvent, useActionState, useState } from "react";

export function LoginForm() {
  const t = useTranslations("LoginPage");

  const [state, action, pending] = useActionState(login, undefined);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form action={action}>
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
            />
            {state?.errors?.email && (
              <Alert variant="destructive">
                <AlertDescription>{state.errors.email[0]}</AlertDescription>
              </Alert>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
            <InputPassword
              id="password"
              name="password"
              placeholder={t("passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
            />
            {state?.errors?.password && (
              <Alert variant="destructive">
                <AlertDescription>
                  <p>{t("passwordCriteria")}</p>
                  <ul className="w-full text-start px-2">
                    {state.errors.password.map((error) => (
                      <li key={error}>- {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </Field>
          {state?.message && (
            <Alert variant={"destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button
            aria-disabled={pending}
            type="submit"
            className="w-full"
            size={"lg"}
          >
            {pending ? t("submitting") : t("submit")}
          </Button>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
