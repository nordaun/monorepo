import "server-only";

import { verifySession } from "@/auth/sessions";
import { cache } from "@repo/cache";
import prisma from "@repo/database";
import { getProfile } from "../auth/dal";
import { Chat } from "./definitions";

export const getChats = async (): Promise<Chat[] | null> => {
  const session = await verifySession();
  if (!session?.userId) return null;

  const chats = await cache(
    `chats:${session.userId}`,
    prisma.chat.findMany({
      where: { members: { some: { id: session.userId } } },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    })
  );

  if (!chats || chats.length === 0) return null;

  const chatsFound = await Promise.all(
    chats.map(async (chat) => {
      return await getChat(chat.id);
    })
  );

  return chatsFound.filter((chat) => chat !== null);
};

export const getChat = async (chatId: string): Promise<Chat | null> => {
  const session = await verifySession();
  if (!session?.userId) return null;

  const chat = await cache(
    `chat:${chatId}`,
    prisma.chat.findFirst({
      where: {
        id: chatId,
        members: { some: { id: session.userId } },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        members: { select: { id: true } },
      },
    })
  );

  if (!chat) return null;

  const chatMembers = await Promise.all(
    chat.members.map(async (member) => {
      return await getProfile(member.id);
    })
  );

  const members = chatMembers.filter((member) => member !== null);
  return { ...chat, members };
};
