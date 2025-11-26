"use client";

import { useTranslations } from "next-intl";

export default function Error() {
  const t = useTranslations("Errors");
  return (
    <div className="flex flex-row items-center justify-center text-center gap-4 min-h-dvh">
      <h3>500</h3>
      <div className="border border-border h-10" />
      <span>{t("error")}</span>
    </div>
  );
}
