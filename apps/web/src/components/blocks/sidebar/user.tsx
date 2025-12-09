import { Profile } from "@/components/ui/profile";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserDropdown from "./dropdown";

export function User() {
  return (
    <SidebarMenu className="group-data-[collapsible=icon]:h-full h-[51px] transition-all">
      <SidebarMenuItem>
        <UserDropdown>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:rounded-full"
          >
            <Profile avatarClassName="group-data-[collapsible=icon]:size-8" />
          </SidebarMenuButton>
        </UserDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
