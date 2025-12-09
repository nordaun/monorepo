import { Profile } from "@/auth/definitions";
import { Attachment, FileState } from "@/files/definitions";

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

type ChatState = FileState;

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
  type Chat,
  type ChatDate,
  type ChatItem,
  type ChatMessage,
  type ChatState,
  type Message,
};
