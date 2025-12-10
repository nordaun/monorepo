"use client";

import { FileInputProvider } from "@/components/blocks/file";
import useChatContext from "@/components/hooks/use-chat";
import useFileContext from "@/components/hooks/use-files";
import { Separator } from "@/components/ui/separator";
import { AllowedMimes } from "@/files/definitions";
import { createContext, useContext } from "react";
import ChatContent from "./content";
import ChatFooter from "./footer";
import ChatHeader from "./header";

const ChatContext = createContext<string | null>(null);

export const useChat = () => {
  const id = useContext(ChatContext);
  if (!id) throw new Error("useChat should be in a Chat component");
  return useChatContext(id);
};

export const useFiles = () => {
  const id = useContext(ChatContext);
  if (!id) throw new Error("useFiles should be in a Chat component");
  return useFileContext(id);
};

export default function Chat({ chatId }: { chatId: string }) {
  return (
    <ChatContext.Provider value={chatId}>
      <div className="w-full flex flex-col overflow-hidden h-full flex-1">
        <ChatHeader />
        <Separator />
        <ChatContent />
        <Separator />
        <FileInputProvider
          providerId={chatId}
          accept={AllowedMimes}
          maxLength={5}
          maxSize={1024 * 1024 * 10}
          resizeWidth={undefined}
          resizeHeight={1080}
        >
          <ChatFooter />
        </FileInputProvider>
      </div>
    </ChatContext.Provider>
  );
}
