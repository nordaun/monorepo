const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "emerald",
  "aqua",
  "blue",
  "purple",
  "pink",
  "white",
] as const;
const locales = ["en", "hu"] as const;

export type Color = (typeof colors)[number];
export type Locale = (typeof locales)[number];

type Config = Readonly<{
  name: string;
  colors: readonly Color[];
  locales: readonly Locale[];
  defaultColor: Color;
  defaultLocale: Locale;
  durations: {
    cache: number;
    emailChange: number;
    session: number;
    license: number;
    upload: number;
    ratelimit: number;
  };
  lengths: {
    otp: number;
    messageChunk: number;
    messageLength: number;
    ratelimit: number;
  };
  urls: {
    main: string;
    cdn: string;
    origins: string[];
  };
}>;

/**
 * ## Application Config
 * @description The global configuration for all of the applications.
 */
const config: Config = {
  name: "Nordaun",
  colors,
  locales,
  defaultColor: "white",
  defaultLocale: "en",
  durations: {
    cache: 1000 * 60 * 10,
    emailChange: 1000 * 60 * 60 * 24 * 3,
    session: 1000 * 60 * 60 * 24 * 30,
    license: 1000 * 60 * 10,
    upload: 10 * 1000,
    ratelimit: 100,
  },
  lengths: {
    otp: 6,
    messageChunk: 20,
    messageLength: 20,
    ratelimit: 60,
  },
  urls: {
    main: "http://localhost:3000",
    cdn: "https://cdn.nordaun.com",
    origins: ["localhost:3000", "192.168.0.123:3000"],
  },
};

export default config;
