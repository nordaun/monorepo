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
import { NavElement, personal } from "./constants";

export function Personal() {
  const elements: NavElement[] = personal;
  const location = usePathname();
  const t = useTranslations("Sidebar");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("personal")}</SidebarGroupLabel>
      <SidebarMenu>
        {elements.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={t(item.title)}
              className={
                location.includes(item.href)
                  ? "bg-accent/75 hover:bg-accent focus:bg-sidebar-accent focus:text-sidebar-accent-foreground"
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
