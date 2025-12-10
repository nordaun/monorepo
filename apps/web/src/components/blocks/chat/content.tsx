"use client";

import { type ChatItem } from "@/chat/definitions";
import useFormatDate from "@/chat/tools/formatDate";
import orderMessages from "@/chat/tools/orderMessages";
import { useEffect, useRef, useState } from "react";
import { useChat } from ".";
import ChatMessage from "../message";

export default function ChatContent() {
  const [loaded, setLoaded] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, loadMessages } = useChat();
  const ordered = orderMessages(messages);

  useEffect(() => {
    if (!loaded && ordered.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView();
        setLoaded(true);
      }, 0);
    }
  }, [loaded, ordered.length]);

  useEffect(() => {
    const topElement = topRef.current;
    if (!topElement) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && loaded) loadMessages();
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    observer.observe(topElement);
    return () => observer.unobserve(topElement);
  }, [loadMessages, loaded]);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="flex-1" />
      <div className="flex flex-col pb-4 gap-1 px-4">
        <div ref={topRef} />
        {ordered.map((item) => (
          <ChatItem key={item.key} item={item} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function ChatItem({ item }: { item: ChatItem }) {
  if (item.type === "date") return <ChatDate date={item.data} />;
  return <ChatMessage message={item.data} avatar={item.avatar} />;
}

function ChatDate({ date }: { date: Date }) {
  return (
    <div className="flex justify-center mt-4 mb-2">
      <div className="text-muted-foreground text-xs">{useFormatDate(date)}</div>
    </div>
  );
}
