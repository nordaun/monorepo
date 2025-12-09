"use client";

import { Separator } from "@/components/ui/separator";
import { usePathname } from "@/i18n/navigation";
import { LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { routes } from "./constants";

export default function DisplayPath() {
  const pathname = usePathname();
  const route = routes.find((r) => pathname.includes(r.title));
  const t = useTranslations("Sidebar");

  return (
    <div className="flex w-full items-center justify-center font-semibold gap-2 h-4">
      {route ? (
        <>
          <route.icon className="size-4 stroke-3" />
          <Separator orientation="vertical" className="border" />
          <span>{t(route.title)}</span>
        </>
      ) : (
        <>
          <LayoutDashboard className="size-4 stroke-3" />
          <Separator orientation="vertical" />
          <span>{t("dashbaord")}</span>
        </>
      )}
    </div>
  );
}
