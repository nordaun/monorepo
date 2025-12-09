"use client";

import { FileInputProvider } from "@/components/blocks/file";
import useFileContext from "@/components/hooks/use-files";
import { AccountAvatarForm } from "./form";

const providerId = "avatar";

export function useFiles() {
  return useFileContext(providerId);
}

export function AccountAvatar() {
  return (
    <FileInputProvider
      providerId={providerId}
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
      <AccountAvatarForm />
    </FileInputProvider>
  );
}
