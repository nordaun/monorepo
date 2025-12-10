/**
 * ## Pick Error
 * Selects an error from many errors, which can be shown to the user.
 * @param errors The errors to pick one from
 * @returns A singe error string
 */
export function pickError(errors?: Record<string, string[]>): string | null {
  if (!errors) return null;
  for (const errorArray of Object.values(errors)) {
    if (errorArray && errorArray.length > 0) return errorArray[0] ?? null;
  }
  return null;
}
