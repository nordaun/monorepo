"use client";

import { useLocale } from "@/i18n/locale";

const timeFormatOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

export default function useFormatTime(date: Date | string): string {
  const locale = useLocale();
  const current = new Date(date);
  return current.toLocaleTimeString(locale, timeFormatOptions);
}
