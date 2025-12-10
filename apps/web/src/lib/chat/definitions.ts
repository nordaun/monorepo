import { Profile } from "@/auth/definitions";
import { Attachment, FileResult } from "@/files/definitions";
import config from "@repo/config";
import { z } from "zod/v4-mini";

const nameModel = z
  .string()
  .check(
    z.minLength(1, { error: "nameShort" }),
    z.maxLength(100, { error: "nameLong" }),
    z.regex(/^[\p{L}\p{N}\p{M}\s._\-()+@!,]+$/u, { error: "nameInvalid" }),
    z.trim()
  );

const textModel = z
  .string()
  .check(
    z.minLength(0, { error: "messageShort" }),
    z.maxLength(config.lengths.messageLength, { error: "messageLong" }),
    z.trim()
  );

const attachmentModel = z
  .number()
  .check(z.minimum(0, { error: "attachmentNotFound" }));

const NameSchema = z.object({
  name: nameModel,
});

const TextSchema = z.object({
  text: textModel,
});

const MessageSchema = z
  .object({
    text: z.optional(textModel),
    attachments: z.optional(attachmentModel),
  })
  .check(
    z.refine(
      (data: { text?: string; attachments?: number }) => {
        const hasText = data.text && data.text.trim().length > 0;
        const hasAttachments =
          data.attachments !== undefined && data.attachments > 0;
        return hasText || hasAttachments;
      },
      { error: "messageInsufficient" }
    )
  );

type ChatMessage = {
  type: "message";
  key: string;
  avatar: boolean;
  data: Message;
};

type ChatDate = {
  type: "date";
  key: string;
  data: Date;
};

type ChatItem = ChatMessage | ChatDate;

type Message = {
  id: string;
  text: string | null;
  author: Profile;
  attachments: Attachment[];
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Chat = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  members: Profile[];
  createdAt: Date;
  updatedAt: Date;
};

type ChatState =
  | {
      errors?: {
        name?: string[];
        text?: string[];
        attachment?: string[];
      };
      message?: string;
      result?: FileResult;
    }
  | undefined;

const ChatReturn = {
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  chatId: true,
  author: {
    select: { id: true, name: true, username: true, avatarUrl: true },
  },
  attachments: {
    select: { id: true, name: true, url: true, size: true, type: true },
  },
};

export {
  ChatReturn,
  MessageSchema,
  NameSchema,
  TextSchema,
  type Chat,
  type ChatDate,
  type ChatItem,
  type ChatMessage,
  type ChatState,
  type Message,
};
