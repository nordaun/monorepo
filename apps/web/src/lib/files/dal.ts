import "server-only";

import { verifySession } from "@/auth/sessions";
import { createId } from "@paralleldrive/cuid2";
import bucket from "@repo/bucket";
import config from "@repo/config";
import prisma from "@repo/database";
import { File as Media } from "@repo/database/types";
import { Attachment, FileResult, Folder, UrlPair } from "./definitions";
import getFileExtension from "./tools/getFileExtension";

export async function createFiles(
  files: Attachment[],
  folder: Folder
): Promise<FileResult | null> {
  const session = await verifySession();
  if (!session?.userId) return null;

  const queue: Omit<Media, "createdAt" | "messageId">[] = [];
  const urlCollection = new Map<Attachment, UrlPair>();

  for (const file of files) {
    const id = createId();
    const extension = getFileExtension(file.type);
    const path = `${folder ? `${folder}/` : ""}${id}.${extension}`;
    const storage = bucket.file(path);

    const signedUrl = (await storage.getSignedUrl({
      action: "write",
      expires: new Date(Date.now() + config.durations.upload),
      contentType: file.type,
      cname: config.urls.cdn,
    })) as unknown as string;

    const publicUrl = `${config.urls.cdn}/${path}`;

    const attachment: Attachment = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
    };

    const urlPair = { signedUrl, publicUrl };

    queue.push({
      ...attachment,
      folder: folder ?? null,
      authorId: session.userId,
    });

    urlCollection.set(attachment, urlPair);
  }

  await prisma.file.createMany({ data: queue });
  return urlCollection;
}

export async function deleteFile(id: string): Promise<Attachment | null> {
  const session = await verifySession();
  if (!session?.userId) return null;

  const existingFile = await prisma.file.findUnique({
    where: { id },
  });
  if (!existingFile || existingFile.authorId !== session.userId) return null;

  const deletedFile = await prisma.file.delete({
    where: { id },
  });

  const folder = deletedFile.folder;

  const attachment: Attachment = {
    id: deletedFile.id,
    name: deletedFile.name,
    size: deletedFile.size,
    type: deletedFile.type,
    url: deletedFile.url,
  };

  const path = `${folder}/${attachment.id}.${getFileExtension(
    attachment.type
  )}`;

  await bucket.file(path).delete();
  return attachment;
}
