import "server-only";

import { verifySession } from "@/auth/sessions";
import prisma from "@repo/database";
import { cache } from "react";
import { Chat } from "./definitions";

export const getChats = cache(async (): Promise<Chat[] | null> => {
  const session = await verifySession();
  if (!session?.userId) return null;

  const chats = await prisma.chat.findMany({
    where: { members: { some: { id: session.userId } } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      members: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
  if (!chats || chats.length === 0) return null;
  return chats;
});

export const getChat = cache(async (chatId: string): Promise<Chat | null> => {
  const session = await verifySession();
  if (!session?.userId) return null;

  const chat = await prisma.chat.findFirst({
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
      members: {
        select: { id: true, name: true, username: true, avatarUrl: true },
      },
    },
  });

  if (!chat) return null;
  return chat;
});
