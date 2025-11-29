"use client";

import { verify } from "@/auth/actions";
import { LicensedRoute } from "@/auth/definitions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useActionState, useState } from "react";

export function VerifyForm() {
  const t = useTranslations("VerifyPage");

  const searchParams = useSearchParams();
  const target: LicensedRoute = searchParams.get("target") as LicensedRoute;

  const [state, action, pending] = useActionState(
    verify.bind(null, target),
    undefined
  );
  const [formData, setFormData] = useState({
    email: "",
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
