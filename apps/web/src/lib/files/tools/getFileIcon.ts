"use client";

import { File, FileText, Music, Video } from "lucide-react";

/**
 * ## Get File Icon
 * Returns the icon for a file based on its mime category.
 * @param type the mime type of the file
 * @returns the icon
 */
export default function getFileIcon(type: string) {
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type.startsWith("application/")) return FileText;
  return File;
}
