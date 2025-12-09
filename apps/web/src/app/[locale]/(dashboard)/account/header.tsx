"use client";

import useSession from "@/components/hooks/use-session";
import config from "@repo/config";
import { useTranslations } from "next-intl";
import { AccountAvatar } from "./avatar";

export default function AccountHeader() {
  const { profile } = useSession();
  const t = useTranslations("AccountPage");

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <AccountAvatar />
      <div className="flex flex-row text-2xl font-semibold text-center">
        <p>{t("greeting")}</p>
        <p className="bg-linear-to-r from-primary/85 to-primary bg-clip-text text-transparent ml-1.5">
          {profile.name}
        </p>
        <p>!</p>
      </div>
      <div className="text-sm text-center">
        {t("description", { brand: config.name })}
      </div>
    </div>
  );
}
