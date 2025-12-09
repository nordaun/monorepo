"use client";

import { useLocale } from "@/i18n/locale";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getRelativeTimeFormat = (days: number, locale: string): string => {
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const result = rtf.format(days, "day");
    return result.charAt(0).toUpperCase() + result.slice(1);
  } catch {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString(locale, dateFormatOptions);
  }
};

export default function useFormatDate(date: Date | string): string {
  const locale = useLocale();
  const current = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(current, today)) return getRelativeTimeFormat(0, locale);
  if (isSameDay(current, yesterday)) return getRelativeTimeFormat(-1, locale);

  return current.toLocaleDateString(locale, dateFormatOptions);
}
