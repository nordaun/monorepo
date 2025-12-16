"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { business, NavElement } from "./constants";

export function Business() {
  const elements: NavElement[] = business;
  const location = usePathname();
  const t = useTranslations("Sidebar");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("business")}</SidebarGroupLabel>
      <SidebarMenu>
        {elements.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={t(item.title)}
              className={
                location.includes(item.href)
                  ? "bg-accent/75 hover:bg-accent"
                  : ""
              }
            >
              <Link href={item.href}>
                <item.icon />
                <span>{t(item.title)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
