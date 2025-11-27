"use client";

import { signup } from "@/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChangeEvent, useActionState, useState } from "react";

export function SignupForm() {
  const t = useTranslations("SignupPage");
  const [agreed, setAgreed] = useState<boolean>(false);

  const [state, action, pending] = useActionState(signup, undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleTerms = () => setAgreed(!agreed);
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
            <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
            <Input
              id="name"
              name="name"
              type="name"
              placeholder={t("namePlaceholder")}
              value={formData.name}
              onChange={handleChange}
            />
            {state?.errors?.name && (
              <Alert variant="destructive">
                <AlertDescription>{state.errors.name[0]}</AlertDescription>
              </Alert>
            )}
          </Field>
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
            <FieldLabel htmlFor="username">{t("usernameLabel")}</FieldLabel>
            <Input
              id="username"
              name="username"
              type="username"
              placeholder={t("usernamePlaceholder")}
              value={formData.username}
              onChange={handleChange}
            />
            {state?.errors?.username && (
              <Alert variant="destructive">
                <AlertDescription>{state.errors.username[0]}</AlertDescription>
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
          <Field orientation="horizontal">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={handleTerms}
            />
            <FieldLabel htmlFor="terms">
              {t("termsLabel")}
              <Link href={"/terms"} className="underline text-foreground">
                {t("termsAction")}
              </Link>
            </FieldLabel>
          </Field>
          {state?.message && (
            <Alert variant={"destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button
            aria-disabled={pending && agreed}
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={!agreed}
          >
            {pending ? t("submitting") : t("submit")}
          </Button>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
