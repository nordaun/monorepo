"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, useEffect, useState } from "react";

export default function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
