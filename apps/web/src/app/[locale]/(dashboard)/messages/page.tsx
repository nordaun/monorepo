import { ChatInfo } from "@/components/blocks/chat/header";
import { Link } from "@/i18n/navigation";
import { getChats } from "@/lib/chat/dal";

export default async function MessagesPage() {
  const chats = await getChats();

  return (
    <div className="flex flex-col items-center justify-center mt-4 px-4 pb-6">
      {chats?.map((chat) => {
        return (
          <Link key={chat.id} href={`/messages/${chat.id}`} className="w-full">
            <div className="flex flex-row items-center gap-2 w-full border-border border-t p-2">
              <ChatInfo
                name={chat.name}
                members={chat.members}
                avatarUrl={chat.avatarUrl}
                updatedAt={chat.updatedAt}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
