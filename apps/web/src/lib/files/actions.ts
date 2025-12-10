"use server";

import { verifySession } from "@/auth/sessions";
import { clearCache } from "@repo/cache";
import prisma from "@repo/database";
import { pusherServer } from "@repo/socket";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { treeifyError } from "zod";
import { createFiles, deleteFile } from "./dal";
import {
  AllowedMimes,
  Attachment,
  AttachmentSchema,
  FileState,
  Metadata,
} from "./definitions";
import getFileSize from "./tools/getFileSize";

/**
 * ## Translate
 * Translates an error object's values or string to the user's preferred language.
 * @param properties the translateable string or object
 * @returns A translated string or object
 */
export async function t(
  properties:
    | Record<string, { errors: readonly string[] } | undefined>
    | string,
  options?: Record<string, string | number | Date> | undefined
) {
  const translate = await getTranslations("Files");
  if (typeof properties === "string")
    return { message: translate(properties, options) };
  const errors: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value?.errors.length) {
      errors[key] = await Promise.all(
        value.errors.map((message) => translate(message, options))
      );
    }
  }
  return { errors };
}

/**
 * ## Upload Avatar Action
 * Uploads a file as a user avatar and returns the urls.
 * @returns The new state of the server action (message or result)
 */
export async function uploadAvatar(
  state: FileState,
  formData: FormData
): Promise<FileState> {
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const files = formData.get("files");
  if (!files) return t("lengthInvalid");

  let attachment: Attachment;

  try {
    const buffer: Metadata = JSON.parse(files.toString())[0];
    attachment = {
      id: buffer.name,
      name: buffer.name,
      type: buffer.type,
      size: buffer.size,
      url: "",
    };
  } catch {
    return t("unexpectedError");
  }

  const validFields = AttachmentSchema({
    maxSize: 1024 * 1024,
    allowedTypes: AllowedMimes.filter((mime) => mime.startsWith("image/")),
  }).safeParse({
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
  });

  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!, {
      name: attachment.name,
    });

  const existingAvatar = await prisma.user.findFirst({
    where: { id: session.userId, avatarUrl: { not: null } },
    select: { avatar: { select: { id: true } } },
  });

  if (existingAvatar?.avatar?.id) await deleteFile(existingAvatar.avatar.id);

  const result = await createFiles([attachment], "avatar");
  if (!result) return t("unexpectedError");

  const avatarUrl = result.values().next().value?.publicUrl;
  await Promise.all([
    prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
      select: { avatarUrl: true },
    }),
    pusherServer.trigger(session.userId, "avatar-update", avatarUrl),
    clearCache(`user:${session.userId}`),
  ]);
  return { result };
}

/**
 * ## Upload Chat Avatar Action
 * Uploads a file as a chat avatar and returns the urls.
 * @param chatId The ID of the chat with the new avatar
 * @returns The new state of the server action (message or result)
 */
export async function uploadChatAvatar(
  chatId: string,
  state: FileState,
  formData: FormData
): Promise<FileState> {
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  const files = formData.get("files");
  if (!files) return t("lengthInvalid");

  let attachment: Attachment;

  try {
    const buffer: Metadata = JSON.parse(files.toString())[0];
    attachment = {
      id: buffer.name,
      name: buffer.name,
      type: buffer.type,
      size: buffer.size,
      url: "",
    };
  } catch {
    return t("unexpectedError");
  }

  const validFields = AttachmentSchema({
    maxSize: 1024 * 1024,
    allowedTypes: AllowedMimes.filter((mime) => mime.startsWith("image/")),
  }).safeParse({
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
  });

  if (!validFields.success)
    return t(treeifyError(validFields.error).properties!, {
      name: attachment.name,
      size: getFileSize(1024 * 1024),
    });

  const existingAvatar = await prisma.chat.findFirst({
    where: {
      id: chatId,
      members: { some: { id: session.userId } },
      avatarUrl: { not: null },
    },
    select: { avatar: { select: { id: true } } },
  });

  if (existingAvatar) await deleteFile(existingAvatar.avatar!.id);

  const result = await createFiles([attachment], "avatar");
  if (!result) return t("unexpectedError");

  const avatarUrl = result.values().next().value?.publicUrl;
  await prisma.chat.update({
    where: { id: chatId },
    data: { avatarUrl },
  });

  revalidatePath(`/messages/${chatId}`);
  return { result };
}

/**
 * ## Upload Attachments
 * Uploads files as chat attachments and returns the urls.
 * @param attachments The attachments (file metadatas) that should be uploaded
 * @returns The result of the upload process (message or results)
 */
export async function uploadAttachments(
  attachments: Attachment[]
): Promise<FileState> {
  const session = await verifySession();
  if (!session?.userId) return t("sessionInvalid");

  if (!attachments) return t("lengthInvalid");

  for (const attachment of attachments) {
    const validFields = AttachmentSchema({
      maxSize: 1024 * 1024,
      allowedTypes: AllowedMimes,
    }).safeParse({
      name: attachment.name,
      size: attachment.size,
      type: attachment.type,
    });

    if (!validFields.success)
      return t(treeifyError(validFields.error).properties!, {
        name: attachment.name,
      });
  }

  const result = await createFiles(attachments, "attachments");
  if (!result) return t("unexpectedError");
  return { result };
}
