import { getUser } from "@/auth/dal";
import AppleButton from "@/components/buttons/apple";
import GoogleButton from "@/components/buttons/google";
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
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LoginPage");
  return { title: t("title"), description: t("description") };
}

export default async function LoginPage() {
  const user = await getUser();
  if (user) return await redirect("/account");
  const t = await getTranslations("LoginPage");

  return (
    <Card className="flex max-w-160 w-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[2vw] lg:py-[4vh] p-0">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col w-full text-sm gap-6">
        <Separator />
        <div className="flex w-full justify-center items-center md:flex-row flex-col gap-4 relative">
          <GoogleButton>{t("loginWithGoogle")}</GoogleButton>
          <AppleButton disabled>
            {t("loginWithApple")}
            <Clock />
          </AppleButton>
        </div>
        <Separator />
        <div className="flex flex-col gap-2.5 items-center">
          <Label>
            {t("signupLabel")}
            <Link href={"/signup"} className="underline text-foreground">
              {t("signupAction")}
            </Link>
          </Label>
          <Label>
            {t("forgotPasswordLabel")}
            <Link href={"/resetpassword"} className="underline text-foreground">
              {t("forgotPasswordAction")}
            </Link>
          </Label>
        </div>
      </CardFooter>
    </Card>
  );
}
