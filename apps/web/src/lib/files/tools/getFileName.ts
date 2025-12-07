/**
 * ## Get File Name
 * Returns the name of a file based on a URL.
 * @param url the URL of the file
 * @returns the name of the file
 */
export default function getFileName(url: string): string {
  const urlParts = url.split("/");
  const fileName = urlParts[urlParts.length - 1];
  return fileName || "file";
}
