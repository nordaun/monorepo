"use client";

import Logo from "@/components/icons/logo";
import { ColorContext } from "@/components/providers/color";
import { useTheme } from "next-themes";
import { useContext } from "react";

function Loading() {
  const { theme } = useTheme();
  const { loading } = useContext(ColorContext);

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-dvh ${
        loading
          ? theme === "light"
            ? "bg-zinc-100"
            : "bg-black"
          : "bg-background"
      }`}
    >
      <div className="relative w-[20dvh] h-[20dvh]">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="text-mask" maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="black" />
              <Logo fill="white" type="square" />
            </mask>
          </defs>
        </svg>
        <div
          className="absolute inset-0 w-full h-full animated-background"
          style={{
            maskImage: "url(#text-mask)",
            WebkitMaskImage: "url(#text-mask)",
          }}
        />
      </div>
      <div className="flex gap-[1dvh] justify-center items-center">
        <div
          className={`size-[1dvh] ${
            loading
              ? theme === "light"
                ? "bg-black"
                : "bg-zinc-100"
              : "bg-primary/70"
          } rounded-full animate-bounce [animation-delay:-0.4s]`}
        />
        <div
          className={`size-[1dvh] ${
            loading
              ? theme === "light"
                ? "bg-black"
                : "bg-zinc-100"
              : "bg-primary/80"
          } rounded-full animate-bounce [animation-delay:-0.2s]`}
        />
        <div
          className={`size-[1dvh] ${
            loading
              ? theme === "light"
                ? "bg-black"
                : "bg-zinc-100"
              : "bg-primary/90"
          } rounded-full animate-bounce`}
        />
      </div>
    </div>
  );
}

export default Loading;
