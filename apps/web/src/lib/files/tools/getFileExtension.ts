import { type Mime } from "../definitions";

/**
 * ## Get File Extension
 * Returns the file extension of a file.
 * @param file the file to get the extension of
 * @returns the file extension
 */
export default function getFileExtension(file: Mime | File) {
  if (typeof file === "string") return file.split("/")[1];
  if (file instanceof File) return file.type.split("/")[1];
  return "unknown";
}
