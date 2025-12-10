"use client";

import { useTranslations } from "next-intl";

/**
 * ## Format Validation
 * Returns a formatter that translates a validation error object/string.
 * @returns function that accepts the untranslated error object/string and an
 * options map and returns a translated error string.
 */
export function useFormatValidation() {
  const t = useTranslations("Files");
  return (
    properties:
      | Record<string, { errors: readonly string[] } | undefined>
      | string,
    options?: Record<string, string | number | Date> | undefined
  ) => {
    if (typeof properties === "string") return t(properties, options);

    const messages: string[] = [];

    for (const value of Object.values(properties)) {
      if (!value?.errors.length) continue;
      messages.push(...value.errors.map((message) => t(message, options)));
    }

    if (messages[0]) return messages[0];
    return t("unexpectedError");
  };
}
