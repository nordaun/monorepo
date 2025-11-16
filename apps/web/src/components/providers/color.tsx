"use client";

import config, { Color } from "@repo/config";
import cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";

type ColorContextType = {
  color: Color;
  setColor: (color: Color) => void;
  loading: boolean;
};

export const ColorContext = createContext<ColorContextType>({
  color: config.defaultColor,
  setColor: () => {},
  loading: true,
});

export default function ColorProvider({ children }: { children: ReactNode }) {
  const cookieName = "NEXT_COLOR";
  const colors = config.colors;
  const defaultColor = config.defaultColor;

  const [current, setCurrent] = useState<Color>(defaultColor);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let initialColor: Color = cookies.get(cookieName) as Color;
    if (!colors.includes(initialColor)) initialColor = defaultColor;
    setCurrent(initialColor);
    document.documentElement.classList.add(`color-${current}`);
    setLoading(false);
  }, [colors, defaultColor, current]);

  const setColor = (newColor: Color) => {
    document.documentElement.classList.remove(`color-${current}`);
    document.documentElement.classList.add(`color-${newColor}`);
    setCurrent(newColor);
    cookies.set(cookieName, newColor);
  };

  if (loading) return null;

  return (
    <ColorContext.Provider value={{ color: current, setColor, loading }}>
      {children}
    </ColorContext.Provider>
  );
}
