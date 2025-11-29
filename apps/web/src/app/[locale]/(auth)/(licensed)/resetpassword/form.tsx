"use client";

import { resetPassword } from "@/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { InputPassword } from "@/components/ui/input-password";
import { useTranslations } from "next-intl";
import { ChangeEvent, useActionState, useState } from "react";

export function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordPage");

  const [state, action, pending] = useActionState(resetPassword, undefined);
  const [formData, setFormData] = useState({
    password: "",
    passwordAgain: "",
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
            <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
            <InputPassword
              id="password"
              name="password"
              placeholder={t("passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="passwordAgain">
              {t("passwordAgain")}
            </FieldLabel>
            <InputPassword
              id="passwordAgain"
              name="passwordAgain"
              placeholder={t("passwordPlaceholder")}
              value={formData.passwordAgain}
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
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button
            aria-disabled={pending}
            type="submit"
            className="mt-2 w-full"
            size={"lg"}
          >
            {pending ? t("submitting") : t("submit")}
          </Button>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
