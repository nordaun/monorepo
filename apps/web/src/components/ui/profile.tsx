"use client";

import { cn } from "@/components/utils";
import { ComponentProps } from "react";
import useSession from "../hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

function getInitial(name: string): string {
  const matches = name.match(/\p{Lu}/gu) || [];
  return matches.slice(0, 2).join("");
}

export function Profile({
  className,
  avatarClassName,
  ...props
}: ComponentProps<"div"> & { avatarClassName?: string }) {
  const { profile } = useSession();

  return (
    <div
      className={cn("flex items-center gap-2 text-left text-sm", className)}
      {...props}
    >
      <Avatar className={cn("size-9 rounded-full", avatarClassName)}>
        <AvatarImage src={profile.avatarUrl!} alt={profile.name} />
        <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
          {getInitial(profile.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{profile.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          @{profile.username}
        </span>
      </div>
    </div>
  );
}
