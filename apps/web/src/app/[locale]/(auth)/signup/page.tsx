import { getUser } from "@/auth/dal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SignupForm } from "./form";

export default async function SignupPage() {
  const user = await getUser();
  if (user) return await redirect("/account");
  const t = await getTranslations("SignupPage");

  return (
    <Card className="flex max-w-160 w-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[2vw] lg:py-[4vh] p-0">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <SignupForm />
      </CardContent>
      <CardFooter className="flex flex-col w-full text-sm gap-6">
        <Separator />
        <Label>
          {t("loginLabel")}
          <Link href={"/login"} className="underline text-foreground">
            {t("loginAction")}
          </Link>
        </Label>
      </CardFooter>
    </Card>
  );
}
