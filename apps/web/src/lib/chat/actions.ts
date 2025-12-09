"use server";

import { verifySession } from "@/auth/sessions";
import { uploadAttachments } from "@/files/actions";
import { Attachment, Metadata } from "@/files/definitions";
import config from "@repo/config";
import prisma from "@repo/database";
import { pusherServer } from "@repo/socket";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { ChatReturn, ChatState, Message } from "./definitions";

/**
 * ## Translate
 * Translates an error object's values or string to the user's preferred language.
 * @param properties the translateable string or object
 * @param options additional variables that make the translation more accurate
 * @returns A translated string or object
 */
export async function t(
  error: string,
  options?: Record<string, string | number | Date> | null
) {
  const translate = await getTranslations("Chat");
  if (options) return { message: translate(error, options) };
  return { message: translate(error) };
}

/**
 * ## Send Message Action
 * Sends a message to a chat.
 * @param chatId The ID of the chat to send the message to.
 * @returns The new state of the server action (message or result).
 */
export async function sendMessage(
  chatId: string,
  state: ChatState,
  formData: FormData
): Promise<ChatState> {
  if (!chatId) return t("chatInvalid");
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const text = formData.get("text")?.toString();
  const files = formData.get("files")?.toString();

  let attachments: Attachment[] = [];

  if (files && files !== "") {
    try {
      const buffers: Metadata[] = JSON.parse(files);
      attachments = buffers.map((buffer) => ({
        id: buffer.name,
        name: buffer.name,
        type: buffer.type,
        size: buffer.size,
        url: "",
      }));
    } catch {
      return t("unexpectedError");
    }
  }

  if ((!text || text === "") && attachments.length === 0)
    return t("messageInsufficient");
  if (
    (text?.length ?? 0) > config.lengths.messageLength &&
    attachments.length === 0
  )
    return t("messageLong");

  const existingChat = await prisma.chat.count({
    where: { id: chatId, members: { some: { id: session.userId } } },
  });
  if (existingChat === 0) return t("chatNotFound");

  const result = await uploadAttachments(attachments);
  if (!result || !result.result) return t("unexpectedError");

  const attachmentIds = Array.from(result.result.keys()).map(
    (a: Attachment) => a.id
  );

  const message: Message = await prisma.message.create({
    data: {
      text: text ? text : null,
      chatId: chatId,
      authorId: session.userId,
      attachments: {
        connect: attachmentIds.map((id) => ({ id })),
      },
    },
    select: ChatReturn,
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  pusherServer.trigger(chatId, "created-message", message);
  return result;
}

/**
 * ## Edit Message Action
 * Edits an existing message in a chat.
 * @param chatId The ID of the chat that contains the message.
 * @returns The new state of the server action (message or result).
 */
export async function editMessage(
  chatId: string,
  state: ChatState,
  formData: FormData
): Promise<ChatState> {
  if (!chatId) return t("chatInvalid");
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const messageId = formData.get("messageId")?.toString();
  const text = formData.get("text")?.toString();

  if (!messageId || messageId === "") return t("messageNotFound");
  if (!text || text === "") return t("messageInsufficient");
  if ((text?.length ?? 0) > config.lengths.messageLength)
    return t("messageLong");

  const existingMessage = await prisma.message.count({
    where: { id: messageId, authorId: session.userId, chatId: chatId },
  });
  if (existingMessage === 0) return t("messageInvalid");

  const message: Message = await prisma.message.update({
    where: { id: messageId, authorId: session.userId, chatId: chatId },
    data: { text, updatedAt: new Date() },
    select: ChatReturn,
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  pusherServer.trigger(chatId, "updated-message", message);
  return { result: new Map() };
}

/**
 * ## Delete Message Action
 * Deletes a message from a chat.
 * @param chatId The ID of the chat the message should be deleted from.
 * @returns The new state of the server action (message or result).
 */
export async function deleteMessage(
  chatId: string,
  state: ChatState,
  formData: FormData
): Promise<ChatState> {
  if (!chatId) return t("chatInvalid");
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const messageId = formData.get("messageId")?.toString();
  if (!messageId || messageId === "") return t("messageNotFound");

  const existingMessage = await prisma.message.count({
    where: { id: messageId, authorId: session.userId, chatId: chatId },
  });
  if (existingMessage === 0) return t("messageInvalid");

  const message: Message = await prisma.message.delete({
    where: { id: messageId, authorId: session.userId, chatId: chatId },
    select: ChatReturn,
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });

  pusherServer.trigger(chatId, "deleted-message", message);
  return { result: new Map() };
}

/**
 * ## Rename Chat Action
 * Renames a chat with 2 or more members.
 * @param chatId The ID of the chat to be renamed.
 * @returns The new state of the server action (message or result).
 */
export async function renameChat(
  chatId: string,
  state: ChatState,
  formData: FormData
): Promise<ChatState> {
  if (!chatId) return t("chatInvalid");
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const name = formData.get("name")?.toString();
  if (!name || name === "") return t("nameInvalid");
  if ((name?.length ?? 0) > 50) return t("nameLong");

  const existingChat = await prisma.chat.count({
    where: {
      id: chatId,
      members: { some: { id: session.userId } },
    },
  });

  if (existingChat === 0) return t("sessionInvalid");

  await prisma.chat.update({
    where: { id: chatId },
    data: { name },
  });

  return { result: new Map() };
}

/**
 * ## Leave Chat Action
 * Removes the current user from a chat.
 * @param chatId The ID of the chat to leave.
 * @returns The new state of the server action (message or result).
 */
export async function leaveChat(chatId: string): Promise<ChatState> {
  if (!chatId) return t("chatInvalid");
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const existingChat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      members: { some: { id: session.userId } },
    },
    select: {
      id: true,
      members: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingChat) return t("chatNotFound");

  if (existingChat.members.length <= 2) {
    await prisma.chat.delete({
      where: { id: chatId },
    });
    await pusherServer.trigger(chatId, "deleted-chat", { id: chatId });
  } else {
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        members: {
          disconnect: { id: session.userId },
        },
        updatedAt: new Date(),
      },
    });
    await pusherServer.trigger(chatId, "left-chat", {
      chatId,
      userId: session.userId,
    });
  }

  revalidatePath("/messages");
  return { result: new Map() };
}
