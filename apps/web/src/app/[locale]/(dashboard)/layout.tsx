import { getProfile } from "@/auth/dal";
import DashboardSidebar from "@/components/blocks/sidebar";
import UserDropdown from "@/components/blocks/sidebar/dropdown";
import Location from "@/components/blocks/sidebar/location";
import SessionProvider from "@/components/providers/session";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "@/i18n/navigation";
import { ChevronFirst, Menu, UserRound } from "lucide-react";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) return await redirect("/login");

  return (
    <SessionProvider initialProfile={profile}>
      <div className="flex size-full">
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="flex h-12.25 shrink-0 items-center gap-2 transition-[width,height] ease-linear border-b border-border">
              <div className="w-full text-start flex justify-start md:hidden group-has-data-[collapsible=icon]/sidebar-wrapper:hidden">
                <SidebarTrigger className="ml-2.5">
                  <Menu className="size-5" />
                </SidebarTrigger>
              </div>
              <div className="w-full text-start md:flex justify-start hidden">
                <SidebarTrigger className="ml-2.5">
                  <ChevronFirst className="size-5 group-has-data-[collapsible=icon]/sidebar-wrapper:rotate-180 transition-[rotate] ease-in-out duration-500" />
                </SidebarTrigger>
              </div>
              <Location />
              <div className="w-full text-right flex justify-end">
                <UserDropdown>
                  <Button
                    variant={"ghost"}
                    className="mr-2.5 p-0 rounded-full aspect-square has-[>svg]:p-0"
                  >
                    <UserRound className="size-5" />
                  </Button>
                </UserDropdown>
              </div>
            </header>
            <ScrollArea className="w-full max-h-[calc(100dvh-48px)] h-full py-2">
              {children}
            </ScrollArea>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionProvider>
  );
}
