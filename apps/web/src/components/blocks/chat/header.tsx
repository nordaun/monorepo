"use client";

import getInitial from "@/chat/tools/getInitial";
import useSession from "@/components/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRightFromLine,
  Settings,
  UsersRound,
} from "lucide-react";
import { useChat } from ".";
import { LeaveDialog } from "./dialogs";
import SettingsDropdown from "./settings";

export default function ChatHeader() {
  const { profile } = useSession();
  const { name, members, avatarUrl } = useChat();
  const fewMembers = members.filter((m) => m.id !== profile.id).slice(0, 3);
  const displayNames = fewMembers.map((m) => m.name);

  return (
    <div className="flex flex-row gap-2 lg:gap-4 items-center justify-between w-full pb-2 px-2">
      <div className="flex flex-row items-center justify-start lg:gap-4 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/messages">
              <Button
                className="aspect-square p-0 rounded-full h-full size-8 lg:bg-muted"
                variant="ghost"
              >
                <ArrowLeft />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Back</TooltipContent>
        </Tooltip>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-4 *:data-[slot=avatar]:ring-2">
          {avatarUrl ? (
            <Avatar className="size-9 lg:size-10.5">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitial(name || "")}
              </AvatarFallback>
            </Avatar>
          ) : (
            fewMembers.map((member) => (
              <Avatar key={member.id} className="size-9 lg:size-10.5">
                <AvatarImage src={member.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitial(member.name)}
                </AvatarFallback>
              </Avatar>
            ))
          )}
        </div>
        <div>{name ? name : displayNames.join(", ")}</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-3">
        <Tooltip>
          <SettingsDropdown>
            <TooltipTrigger asChild>
              <Button
                variant={"secondary"}
                className="aspect-square rounded-full h-full size-8"
              >
                <Settings />
              </Button>
            </TooltipTrigger>
          </SettingsDropdown>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"secondary"}
              className="aspect-square rounded-full h-full size-8"
            >
              <UsersRound />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Invite</TooltipContent>
        </Tooltip>
        <Tooltip>
          <LeaveDialog>
            <TooltipTrigger asChild>
              <Button
                className="aspect-square rounded-full h-full size-8"
                variant={"destructive"}
              >
                <ArrowRightFromLine />
              </Button>
            </TooltipTrigger>
          </LeaveDialog>
          <TooltipContent>Leave</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
