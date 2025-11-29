"use client";

import { terminateAccount } from "@/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";

export function TerminateAccountForm() {
  const t = useTranslations("TerminateAccountPage");
  const [agreed, setAgreed] = useState<boolean>(false);

  const [state, action, pending] = useActionState(terminateAccount, undefined);

  const handleChange = () => setAgreed(!agreed);

  return (
    <form action={action}>
      <FieldGroup>
        <FieldSet>
          <Field>
            <ScrollArea className="h-80 w-full rounded-md border px-4 py-4">
              <div className="text-justify font-light text-sm">
                {t("legal")}
              </div>
            </ScrollArea>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={handleChange}
            />
            <FieldLabel htmlFor="terms">{t("terms")}</FieldLabel>
          </Field>
          {state?.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button
            aria-disabled={pending && agreed}
            type="submit"
            className="mt-2 w-full"
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
