import { getLicense } from "@/auth/dal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "./form";

export default async function ResetPasswordPage() {
  const license = await getLicense();
  if (license?.target !== "resetpassword" || license.signed !== true)
    return redirect("/verify?target=resetpassword");

  const t = await getTranslations("ResetPasswordPage");

  return (
    <Card className="flex max-w-160 w-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[2vw] lg:py-[4vh] p-0">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
