import { getChat } from "@/chat/dal";
import Chat from "@/components/blocks/chat";
import ChatProvider from "@/components/providers/chat";
import { redirect } from "@/i18n/navigation";

type PageProps = {
  params: { chatId: string };
};

export default async function ChatPage({ params }: PageProps) {
  const { chatId } = await params;
  const chat = await getChat(chatId);

  if (!chat) return redirect("/messages");

  return (
    <div className="flex w-full h-[calc(100dvh-72px)]">
      <ChatProvider
        providerId={chatId}
        name={chat.name}
        avatarUrl={chat.avatarUrl}
        members={chat.members}
      >
        <Chat chatId={chatId} />
      </ChatProvider>
    </div>
  );
}
