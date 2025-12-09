import { LicensedRoute, LicensedRoutes } from "@/auth/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { VerifyForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("VerifyPage");
  return { title: t("title"), description: t("description") };
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ target: LicensedRoute }>;
}) {
  const target: LicensedRoute = (await searchParams).target as LicensedRoute;
  if (!LicensedRoutes[target] || LicensedRoutes[target].hidden)
    return notFound();
  const t = await getTranslations("VerifyPage");

  return (
    <Card className="flex max-w-160 w-full justify-center items-center text-center lg:bg-card lg:border border-0 bg-transparent lg:px-[2vw] lg:py-[4vh] p-0">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <VerifyForm />
      </CardContent>
    </Card>
  );
}
