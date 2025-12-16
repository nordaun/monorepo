import config from "@repo/config";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: config.locales,
  defaultLocale: config.defaultLocale,
});
