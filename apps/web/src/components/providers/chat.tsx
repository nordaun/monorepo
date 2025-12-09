"use client";

import { Chat, Message } from "@/chat/definitions";
import config from "@repo/config";
import { pusherClient } from "@repo/socket";
import ky from "ky";
import {
  Context,
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatParams = Omit<Chat, "id" | "createdAt" | "updatedAt"> & {
  providerId: Chat["id"];
};

type ChatContext = ChatParams & {
  providerId: string;
  draft: string;
  messages: Message[];
  loadMessages: () => Promise<void>;
  setDraft: (draft: string) => void;
};

const existingContexts = new Map<string, Context<ChatContext>>();
const initializedIds = new Map<string, boolean>();

const defaultContext: ChatContext = {
  providerId: "",
  name: "",
  avatarUrl: "",
  members: [],
  draft: "",
  messages: [],
  loadMessages: async () => {},
  setDraft: () => {},
};

export function matchContext(chatId: string): Context<ChatContext> {
  if (!existingContexts.has(chatId))
    existingContexts.set(chatId, createContext<ChatContext>(defaultContext));
  return existingContexts.get(chatId)!;
}

export default function ChatProvider({
  providerId,
  name,
  avatarUrl,
  members,
  children,
}: ChatParams & { children: ReactNode }) {
  const messageChunkSize = config.lengths.messageChunk;

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  const hasMoreRef = useRef(true);
  const fromRef = useRef(0);
  const isLoadingRef = useRef(false);

  const updateMessages = useCallback(
    (newMessages: Message[]) => {
      if (newMessages.length < messageChunkSize) hasMoreRef.current = false;
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const filtered = newMessages.filter((m) => !existingIds.has(m.id));
        return [...prev, ...filtered];
      });
      fromRef.current += newMessages.length;
    },
    [messageChunkSize]
  );

  const loadMessages = useCallback(async () => {
    if (!hasMoreRef.current || isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const newMessages = await ky
        .get(`/api/chat/${providerId}/messages`, {
          searchParams: {
            from: fromRef.current,
            count: messageChunkSize,
          },
        })
        .json<Message[] | null>();
      if (!newMessages) return;
      updateMessages(newMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [providerId, messageChunkSize, updateMessages]);

  const resetChat = () => {
    setMessages([]);
    setDraft("");
    fromRef.current = 0;
    hasMoreRef.current = true;
    isLoadingRef.current = false;
  };

  useEffect(() => {
    const channel = pusherClient.subscribe(providerId);

    channel
      .bind("created-message", (message: Message) => {
        setMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message]
        );
      })
      .bind("updated-message", (message: Message) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? message : m))
        );
      })
      .bind("deleted-message", (message: Message) => {
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
      });

    // Only load messages once per chat
    if (!initializedIds.get(providerId)) {
      initializedIds.set(providerId, true);
      loadMessages();
    }

    return () => {
      pusherClient.unsubscribe(providerId);
      resetChat();
    };
  }, [providerId, loadMessages]);

  const values: ChatContext = {
    providerId,
    name,
    avatarUrl,
    members,
    draft,
    messages,
    loadMessages,
    setDraft,
  };

  const Context = matchContext(providerId);

  return <Context.Provider value={values}>{children}</Context.Provider>;
}
