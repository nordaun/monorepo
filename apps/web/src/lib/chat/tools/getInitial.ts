"use client";

export default function getInitial(name: string): string {
  const matches = name.match(/\p{Lu}/gu) || [];
  return matches.slice(0, 2).join("");
}
