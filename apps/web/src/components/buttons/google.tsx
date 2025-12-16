"use client";

import { cn } from "@/components/utils";
import config from "@repo/config";
import { ComponentProps } from "react";
import GoogleLogo from "../icons/google";
import { Button } from "../ui/button";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS_ID;
const googleRedirectUrl = `${config.urls.main}/api/auth/google`;

function triggerGoogleLogin() {
  if (!googleClientId || !googleRedirectUrl)
    throw new Error("Google OAuth credentials are not configured");
  const thirdPartyUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(googleRedirectUrl)}&response_type=code&scope=email profile`;
  window.location.replace(thirdPartyUrl);
}

export default function GoogleButton({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <Button
      name="loginWithGoogle"
      variant={"secondary"}
      size={"lg"}
      className={cn(
        "flex items-center justify-center gap-4 p-2 transition-none text-muted-foreground w-full flex-1",
        className
      )}
      onClick={() => triggerGoogleLogin()}
      {...props}
    >
      <GoogleLogo className="size-4.5" />
      {children}
    </Button>
  );
}
