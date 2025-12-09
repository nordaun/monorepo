import Logo from "@/components/icons/logo";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Business } from "./business";
import { Personal } from "./personal";
import { User } from "./user";

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center h-12">
        <Logo
          type="banner"
          aria-label="logo"
          className="h-[45%] group-data-[collapsible=icon]:hidden block"
        />
        <Logo
          type="icon"
          aria-label="logo"
          className="h-[70%] group-data-[collapsible=icon]:block hidden"
        />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <Business />
        <Separator />
        <Personal />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <User />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
