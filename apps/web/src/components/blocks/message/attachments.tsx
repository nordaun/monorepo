"use client";

import { Profile } from "@/auth/definitions";
import useSession from "@/components/hooks/use-session";
import { cn } from "@/components/utils";
import { Attachment } from "@/files/definitions";
import getFileName from "@/files/tools/getFileName";
import { File, FileText, Music, Video } from "lucide-react";
import Image from "next/image";

export default function ChatAttachments({
  author,
  attachments,
}: {
  author: Profile;
  attachments: Attachment[];
}) {
  const { profile } = useSession();
  const isOwnMessage = author.id === profile.id;
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 w-full mb-0.5">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={cn(
            "flex w-full",
            isOwnMessage ? "justify-end" : "justify-start"
          )}
        >
          {attachment.type.startsWith("image/") ? (
            <ChatImageAttachment attachment={attachment} />
          ) : (
            <ChatFileAttachment attachment={attachment} />
          )}
        </div>
      ))}
    </div>
  );
}

export function ChatImageAttachment({
  attachment,
}: {
  attachment: Attachment;
}) {
  const fileName = getFileName(attachment.url);

  return (
    <div className="relative group max-w-sm max-h-80">
      <Image
        width={512}
        height={512}
        src={attachment.url}
        alt={fileName}
        className="rounded-xl w-auto h-auto max-w-full max-h-80 object-contain cursor-pointer hover:opacity-90 transition-opacity"
        priority
      />
    </div>
  );
}

export function ChatFileAttachment({ attachment }: { attachment: Attachment }) {
  const fileName = getFileName(attachment.url);
  const isVideo = attachment.type.startsWith("video/");
  const isAudio = attachment.type.startsWith("audio/");
  const isApplication = attachment.type.startsWith("application/");

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors cursor-pointer max-w-xs sm:max-w-sm w-full">
      <div className="shrink-0">
        {isVideo ? (
          <Video className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        ) : isAudio ? (
          <Music className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        ) : isApplication ? (
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        ) : (
          <File className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
          {fileName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {attachment.type}
        </p>
      </div>
    </div>
  );
}
