import { Attachment, Mime } from "../definitions";
import getFileSize from "./getFileSize";

/**
 * ## Validate File
 * Validates a file's name, size and mime type.
 * @param file the file to validate
 * @param maxSize the maximum size of the file in bytes
 * @param mimes the allowed mime types
 * @returns the validation result
 */
export function validateFile({
  file,
  maxSize,
  mimes,
}: {
  file: Attachment;
  maxSize: number;
  mimes: Mime[];
}): [string | null, Record<string, string | number | Date> | null] {
  const fileNameRegex = /^[\w\-. ]+$/u;
  if (!fileNameRegex.test(file.id)) return ["nameInvalid", { name: file.id }];
  if (file.size > maxSize)
    return ["sizeInvalid", { name: file.id, size: getFileSize(maxSize) }];
  if (!mimes.includes(file.type as Mime))
    return ["typeInvalid", { name: file.id }];
  return [null, null];
}
