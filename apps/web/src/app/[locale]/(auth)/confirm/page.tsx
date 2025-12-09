import { getLicense } from "@/auth/dal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "@/i18n/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConfirmForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ConfirmPage");
  return { title: t("title"), description: t("description") };
}

export default async function ConfirmPage() {
  const license = await getLicense();
  if (!license) return await redirect("/login");

  const t = await getTranslations("ConfirmPage");

  return (
    <Card className="flex max-w-160 w-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[2vw] lg:py-[4vh] p-0">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ConfirmForm />
      </CardContent>
    </Card>
  );
}
