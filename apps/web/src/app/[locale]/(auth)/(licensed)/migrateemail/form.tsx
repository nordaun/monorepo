"use client";

import { migrateEmail } from "@/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { ChangeEvent, useActionState, useState } from "react";

export function MigrateEmailForm() {
  const t = useTranslations("MigrateEmailPage");

  const [state, action, pending] = useActionState(migrateEmail, undefined);
  const [formData, setFormData] = useState({
    email: "",
    emailAgain: "",
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
          </Field>
          <Field>
            <FieldLabel htmlFor="emailAgain">{t("emailAgain")}</FieldLabel>
            <Input
              id="email"
              name="emailAgain"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={formData.emailAgain}
              onChange={handleChange}
            />
            {state?.errors?.email && (
              <Alert variant="destructive">
                <AlertDescription>{state.errors.email[0]}</AlertDescription>
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
