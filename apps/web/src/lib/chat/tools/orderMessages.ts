"use client";

import { ChatItem, Message } from "../definitions";

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export default function orderMessages(messages: Message[]) {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const ordered: ChatItem[] = [];

  for (let i = 0; i < sortedMessages.length; i++) {
    const current = sortedMessages[i] as Message;
    const previous = sortedMessages[i - 1];
    const currentDate = new Date(current.createdAt);
    const previousDate = previous ? new Date(previous.createdAt) : null;

    const needDate: boolean =
      !previousDate || !isSameDay(currentDate, previousDate);

    const needAvatar: boolean =
      !previousDate ||
      previous?.author.id !== current.author.id ||
      !isSameDay(currentDate, previousDate);

    if (needDate)
      ordered.push({
        type: "date",
        data: currentDate,
        key: `date-${currentDate.toISOString()}`,
      });

    ordered.push({
      type: "message",
      data: current,
      avatar: needAvatar,
      key: `message-${current.id}`,
    });
  }

  return ordered;
}
