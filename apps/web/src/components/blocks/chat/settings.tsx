"use client";

import useFileContext from "@/components/hooks/use-files";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useRef } from "react";
import { FileInputProvider } from "../file";
import { AvatarDialog, NameDialog } from "./dialogs";

const providerId = "chatAvatar";

export function useAvatarFiles() {
  return useFileContext(providerId);
}

export default function SettingsDropdown({
  children,
}: {
  children: ReactNode;
}) {
  const nameRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex">
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => nameRef.current?.click()}>
            Change chat name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => avatarRef.current?.click()}>
            Change chat avatar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NameDialog>
        <div className="hidden" ref={nameRef} />
      </NameDialog>
      <FileInputProvider
        providerId={"chatAvatar"}
        accept={[
          "image/webp",
          "image/jpeg",
          "image/png",
          "image/heic",
          "image/heif",
        ]}
        maxLength={1}
        maxSize={1024 * 1024}
        resizeWidth={512}
        resizeHeight={512}
      >
        <AvatarDialog>
          <div className="hidden" ref={avatarRef} />
        </AvatarDialog>
      </FileInputProvider>
    </div>
  );
}
