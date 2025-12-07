/**
 * ## Get File Size
 * Returns a file's formatted size (like 128 B or 1.6 GB).
 * @param bytes the size of the file in bytes
 * @returns the formatted size
 */
export default function getFileSize(bytes: number) {
  if (!bytes || bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(size % 1 === 0 ? 0 : 2)} ${units[i]}`;
}
