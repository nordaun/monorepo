"use client";

import { useContext } from "react";
import { SessionContext } from "../providers/session";

export default function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error(
      `The useSession() hook must be used within a SessionProvider.`
    );
  return context;
}
