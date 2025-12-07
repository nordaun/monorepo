"use server";

import { verifySession } from "@/auth/sessions";
import prisma from "@repo/database";
import { pusherServer } from "@repo/socket";
import { getTranslations } from "next-intl/server";
import { createFiles, deleteFile } from "./dal";
import { AllowedMimes, Attachment, FileState, Metadata } from "./definitions";
import { validateFile } from "./tools/validateFile";

/**
 * ## Translate
 * Translates an error object's values or string to the user's preferred language.
 * @param properties the translateable string or object
 * @param options additional variables that make the translation more accurate
 * @returns A translated string or object
 */
async function t(
  error: string,
  options?: Record<string, string | number | Date> | null
) {
  const translate = await getTranslations("Files");
  if (options) return { message: translate(error, options) };
  return { message: translate(error) };
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
  if (!files) return t("filesEmpty");

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

  const [error, options] = validateFile({
    file: attachment,
    maxSize: 1024 * 1024,
    mimes: AllowedMimes.filter((mime) => mime.startsWith("image/")),
  });
  if (error) return t(error, options);

  const existingAvatar = await prisma.user.findFirst({
    where: { id: session.userId, avatarUrl: { not: null } },
    select: { avatar: { select: { id: true } } },
  });

  if (existingAvatar?.avatar?.id) await deleteFile(existingAvatar.avatar.id);

  const result = await createFiles([attachment], "avatar");
  if (!result) return t("unexpectedError");

  const avatarUrl = result.values().next().value?.publicUrl;
  await prisma.user.update({
    where: { id: session.userId },
    data: { avatarUrl },
    select: { avatarUrl: true },
  });

  await pusherServer.trigger(session.userId, "avatar-update", avatarUrl);
  return { result };
}
