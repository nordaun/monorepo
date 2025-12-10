import { Message } from "@/chat/definitions";
import useFormatTime from "@/chat/tools/formatTime";
import getInitial from "@/chat/tools/getInitial";
import useSession from "@/components/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/components/utils";
import { createContext, useContext } from "react";
import ChatAttachments from "./attachments";
import MessageDropdown from "./options";

const MessageContext = createContext<Message | null>(null);

export const useMessage = () => {
  const message = useContext(MessageContext);
  if (!message) throw new Error("useMessage should be in a Message component");
  return message;
};

export default function ChatMessage({
  message,
  avatar,
}: {
  message: Message;
  avatar: boolean;
}) {
  const { profile } = useSession();
  const isOwnMessage = message.author.id === profile.id;
  const createdAt = useFormatTime(message.createdAt);

  return (
    <MessageContext.Provider value={message}>
      <div
        className={cn(
          "flex w-full gap-3",
          isOwnMessage ? "flex-row-reverse" : "flex-row",
          avatar && "mt-2"
        )}
      >
        <div className={cn("w-12 hidden lg:block", avatar ? "h-12" : "h-8")}>
          {avatar && (
            <Avatar className="size-full">
              <AvatarImage
                src={message.author.avatarUrl!}
                alt={message.author.name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitial(message.author.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div
          className={cn(
            "flex flex-col gap-2 h-full max-w-[80%] lg:max-w-[40%]",
            isOwnMessage ? "items-end" : "items-start"
          )}
        >
          {avatar && (
            <div
              className={cn(
                "flex text-xs text-muted-foreground h-2.5",
                isOwnMessage ? "flex-row-reverse" : "flex-row"
              )}
            >
              <p className="lg:hidden text-foreground">
                @{message.author.username}
              </p>
              <p className="lg:hidden mx-1">•</p>
              <p>{createdAt}</p>
            </div>
          )}
          <MessageDropdown>
            {message.text && (
              <div
                className={cn(
                  "flex items-center justify-center w-fit min-h-7.5 px-3 py-1 rounded-xl text-sm wrap-break-word whitespace-pre-wrap",
                  isOwnMessage
                    ? "bg-linear-to-b from-primary to-primary/90 text-primary-foreground"
                    : "bg-linear-to-b from-accent to-accent/90 text-accent-foreground"
                )}
              >
                {message.text}
              </div>
            )}
            {message.attachments && (
              <ChatAttachments
                author={message.author}
                attachments={message.attachments}
              />
            )}
          </MessageDropdown>
        </div>
      </div>
    </MessageContext.Provider>
  );
}
