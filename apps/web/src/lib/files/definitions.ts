import { File } from "@repo/database/types";

const Mimes = {
  application: [
    "pdf",
    "msword",
    "vnd.openxmlformats-officedocument.wordprocessingml.document",
    "vnd.ms-excel",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "vnd.ms-powerpoint",
    "vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  video: ["webm", "mp4", "mpeg", "ogg", "quicktime"],
  image: ["webp", "jpeg", "png", "gif", "heic", "heif"],
  text: ["plain", "csv", "xml"],
} as const satisfies Record<string, string[]>;

const Folders = ["avatar", "attachments"] as const;

type MimeCategory = keyof typeof Mimes;

type Mime =
  | {
      [category in MimeCategory]: `${category}/${(typeof Mimes)[category][number]}`;
    }[MimeCategory]
  | (string & {});

const AllowedMimes: Mime[] = Object.entries(Mimes).flatMap(
  ([category, types]) => types.map((type) => `${category}/${type}` as Mime)
);

type UrlPair = {
  signedUrl: string;
  publicUrl: string;
};

type Folder = (typeof Folders)[number] | (string & {}) | undefined;
type Attachment = Pick<File, "id" | "name" | "size" | "type" | "url">;
type Metadata = Pick<Attachment, "name" | "size" | "type">;
type FileResult = Map<Attachment, UrlPair>;
type FileState = { message?: string; result?: FileResult } | undefined;

export {
  AllowedMimes,
  Folders,
  type Attachment,
  type FileResult,
  type FileState,
  type Folder,
  type Metadata,
  type Mime,
  type UrlPair,
};
