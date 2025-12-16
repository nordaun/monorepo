"use client";

import { logout } from "@/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Profile } from "@/components/ui/profile";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { profile } from "./constants";

export default function ProfileDropdown({ children }: { children: ReactNode }) {
  const { isMobile } = useSidebar();
  const location = usePathname();
  const t = useTranslations("Sidebar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg p-2 bg-sidebar"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={16}
      >
        <DropdownMenuLabel className="pb-2 font-normal">
          <Profile />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col gap-0.5 my-1">
          {profile.map((item) => (
            <Link key={item.title} href={item.href}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    location.includes(item.href)
                      ? "bg-accent/75 hover:bg-accent"
                      : ""
                  }
                >
                  <item.icon />
                  {t(item.title)}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOut />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
