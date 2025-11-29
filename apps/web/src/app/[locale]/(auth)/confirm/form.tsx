"use client";

import { confirm } from "@/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import config from "@repo/config";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";

export function ConfirmForm() {
  const t = useTranslations("ConfirmPage");

  const [state, action, pending] = useActionState(confirm, undefined);
  const [otp, setOtp] = useState("");

  const handleChange = (value: string) => {
    setOtp(value);
  };

  return (
    <form action={action}>
      <FieldGroup>
        <FieldSet>
          <Field>
            <InputOTP
              maxLength={config.lengths.otp}
              value={otp}
              onChange={handleChange}
              name="otp"
              id="otp"
            >
              <InputOTPGroup className="flex w-full justify-center">
                {[...Array(config.lengths.otp)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} className="size-14" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {state?.errors?.otp && (
              <Alert variant="destructive">
                <AlertDescription>{state.errors.otp[0]}</AlertDescription>
              </Alert>
            )}
          </Field>

          {state?.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button
            aria-disabled={pending || otp.length !== config.lengths.otp}
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
